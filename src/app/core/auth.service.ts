import {
  Inject,
  Injectable,
  NgZone,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';

import { Observable, Subject } from 'rxjs';

import {
  AuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  OAuthCredential,
  UserCredential,
  getAuth,
  getRedirectResult,
  signInWithCredential,
  signInWithPopup,
  signInWithRedirect,
  signOut
} from '@angular/fire/auth';

import {
  AuthStateChange,
  FirebaseAuthentication,
  SignInResult,
  SignInWithOAuthOptions,
  User
} from '@capacitor-firebase/authentication';

import { SignInProvider } from './auth-definitions';
import { AuthHelper } from './auth.helper';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  currentUser: User | null = null;
  authLoader: HTMLIonLoadingElement | undefined;
  redirectResultSubject: Subject<any> = new Subject<any>();
  authStateSubject: Subject<AuthStateChange> = new Subject<AuthStateChange>();

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public platform: Platform,
    private ngZone: NgZone,
    private authHelper: AuthHelper,
    public loadingController: LoadingController,
    public location: Location,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      FirebaseAuthentication.removeAllListeners().then(() => {
        FirebaseAuthentication.addListener(
          'authStateChange',
          (change: AuthStateChange) => {
            this.ngZone.run(() => {
              this.authStateSubject.next(change);
            });

            if (change?.user) {
              // ? User is signed in.
              this.currentUser = change.user;
            } else {
              // ? No user is signed in.
              this.currentUser = null;
            }
          }
        );
      });

      // ? We should only listen for firebase auth redirect results when we have the flag 'auth-redirect' in the query params
      this.route.queryParams.subscribe((params) => {
        const authProvider = params['auth-redirect'];

        if (authProvider) {
          // ? Show a loader while we receive the getRedirectResult notification
          this.presentLoading(authProvider);

          // ? When using signInWithRedirect, this listens for the redirect results
          const auth = getAuth();
          getRedirectResult(auth)
            .then(
              (result) => {
                // ? result.credential.accessToken gives you the Provider Access Token. You can use it to access the Provider API.
                // const credential = FacebookAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                let credential: any;

                if (result && result !== null) {
                  switch (result.providerId) {
                    case SignInProvider.apple:
                      credential = OAuthProvider.credentialFromResult(result);
                      break;
                    case SignInProvider.facebook:
                      credential =
                        FacebookAuthProvider.credentialFromResult(result);
                      break;
                    case SignInProvider.google:
                      credential =
                        GoogleAuthProvider.credentialFromResult(result);
                      break;
                    case SignInProvider.twitter:
                      credential =
                        TwitterAuthProvider.credentialFromResult(result);
                      break;
                  }

                  const signInResult = authHelper.createSignInResult(
                    result,
                    credential
                  );

                  this.dismissLoading();

                  this.redirectResultSubject.next(signInResult);
                } else {
                  throw new Error('Could not get user from redirect result');
                }
              },
              (reason) => {
                console.log('Promise rejected', reason);

                // ? Clear redirection loading
                this.clearAuthWithProvidersRedirection();
              }
            )
            .catch((error) => {
              // ? Clear redirection loading
              this.clearAuthWithProvidersRedirection();

              // ? Handle Errors here
              // const errorCode = error.code;
              // const errorMessage = error.message;
              // ? The email of the user's account used.
              // const email = error.email;
              // ?AuthCredential type that was used.
              // const credential = FacebookAuthProvider.credentialFromError(error);

              let errorResult = { error: 'undefined' };

              if (error && (error.code || error.message)) {
                errorResult = {
                  error: error.code ? error.code : error.message
                };
              }

              this.redirectResultSubject.next(errorResult);
            });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.dismissLoading();
  }

  private prepareForAuthWithProvidersRedirection(authProviderId: string): void {
    // ? Before invoking auth provider redirect flow, add a flag to the path.
    // ? The presence of the flag in the path indicates we should wait for the auth redirect to complete
    this.location.replaceState(
      this.location.path(),
      'auth-redirect=' + authProviderId,
      this.location.getState()
    );
  }

  private clearAuthWithProvidersRedirection(): void {
    // ? Remove auth-redirect param from url
    this.location.replaceState(this.router.url.split('?')[0], '');
    this.dismissLoading();
  }

  private async presentLoading(authProviderId?: string): Promise<void> {
    let message: string;

    if (authProviderId) {
      const authProviderCapitalized =
        authProviderId[0].toUpperCase() + authProviderId.slice(1);
      message = 'Signing in with ' + authProviderCapitalized;
    } else {
      message = 'Signing in ...';
    }

    this.loadingController
      .create({
        message: message,
        duration: 4000
      })
      .then((loader) => {
        this.authLoader = loader;
        this.authLoader.present();
      });
  }

  private async dismissLoading(): Promise<void> {
    if (this.authLoader) {
      await this.authLoader.dismiss();
    }
  }

  public async signOut(): Promise<string> {
    const signOutPromise = new Promise<string>((resolve, reject) => {
      // * 1. Sign out on the native layer
      FirebaseAuthentication.signOut()
        .then((nativeResult) => {
          // * 2. Sign out on the web layer
          const auth = getAuth();
          signOut(auth)
            .then((webResult) => {
              // ? Sign-out successful
              Preferences.remove({ key: 'token' }).then();
              resolve('Successfully sign out from native and web');
            })
            .catch((webError) => {
              // ? An error happened
              reject(`Web auth sign out error: ${webError}`);
            });
        })
        .catch((nativeError) => {
          reject(`Native auth sign out error: ${nativeError}`);
        });
    });

    return signOutPromise;
  }

  private async socialSignIn(
    provider:
      | OAuthProvider
      | GoogleAuthProvider
      | FacebookAuthProvider
      | TwitterAuthProvider,
    authOptions?: SignInWithOAuthOptions
  ): Promise<SignInResult> {
    this.presentLoading(provider.providerId);

    let authResult: SignInResult | null = null;

    if (this.platform.is('capacitor')) {
      authResult = await this.nativeAuth(provider, authOptions);
    } else {
      authResult = await this.webAuth(provider, authOptions);
    }

    this.dismissLoading();

    if (authResult !== null) {
      return authResult;
    } else {
      return Promise.reject(
        'Could not perform social sign in, authResult is null'
      );
    }
  }

  private async webAuth(
    provider:
      | OAuthProvider
      | GoogleAuthProvider
      | FacebookAuthProvider
      | TwitterAuthProvider,
    authOptions?: SignInWithOAuthOptions
  ): Promise<SignInResult> {
    const auth = getAuth();
    let webAuthUserCredential: UserCredential | null = null;

    this.authHelper.applySignInOptions(authOptions || {}, provider);

    if (this.platform.is('desktop')) {
      webAuthUserCredential = await signInWithPopup(auth, provider);
    } else {
      // ? Web but not desktop, for example mobile PWA
      this.prepareForAuthWithProvidersRedirection(provider.providerId);
      return signInWithRedirect(auth, provider);

      // ? If you prefer to use signInWithPopup in every scenario, just un-comment this line
      // webAuthUserCredential = await signInWithPopup(auth, provider);
    }

    if (webAuthUserCredential && webAuthUserCredential !== null) {
      let webCredential: OAuthCredential | null = null;

      switch (provider.providerId) {
        case SignInProvider.apple:
          webCredential = OAuthProvider.credentialFromResult(
            webAuthUserCredential
          );
          break;
        case SignInProvider.facebook:
          webCredential = FacebookAuthProvider.credentialFromResult(
            webAuthUserCredential
          );
          break;
        case SignInProvider.google:
          webCredential = GoogleAuthProvider.credentialFromResult(
            webAuthUserCredential
          );
          break;
        case SignInProvider.twitter:
          webCredential = TwitterAuthProvider.credentialFromResult(
            webAuthUserCredential
          );
          break;
      }

      return this.authHelper.createSignInResult(
        webAuthUserCredential,
        webCredential
      );
    } else {
      return Promise.reject('null webAuthUserCredential');
    }
  }

  private async nativeAuth(
    provider: AuthProvider,
    authOptions?: SignInWithOAuthOptions
  ): Promise<SignInResult> {
    let nativeAuthResult: SignInResult | null = null;

    // * 1. Sign in on the native layer
    switch (provider.providerId) {
      case SignInProvider.apple:
        nativeAuthResult = await FirebaseAuthentication.signInWithApple(
          authOptions
        );
        break;
      case SignInProvider.facebook:
        nativeAuthResult = await FirebaseAuthentication.signInWithFacebook(
          authOptions
        );
        break;
      case SignInProvider.google:
        nativeAuthResult = await FirebaseAuthentication.signInWithGoogle(
          authOptions
        );
        break;
      case SignInProvider.twitter:
        nativeAuthResult = await FirebaseAuthentication.signInWithTwitter(
          authOptions
        );
        break;
    }

    // ? Once we have the user authenticated on the native layer, authenticate it in the web layer
    if (
      nativeAuthResult !== null &&
      nativeAuthResult.credential &&
      nativeAuthResult.credential.accessToken
    ) {
      const auth = getAuth();
      let nativeCredential: OAuthCredential | null = null;

      switch (provider.providerId) {
        case SignInProvider.apple:
          const provider = new OAuthProvider(SignInProvider.apple);
          nativeCredential = provider.credential({
            idToken: nativeAuthResult.credential.idToken,
            rawNonce: nativeAuthResult.credential.nonce
          });
          break;
        case SignInProvider.facebook:
          nativeCredential = FacebookAuthProvider.credential(
            nativeAuthResult.credential.accessToken
          );
          break;
        case SignInProvider.google:
          nativeCredential = GoogleAuthProvider.credential(
            nativeAuthResult.credential.idToken,
            nativeAuthResult.credential.accessToken
          );
          break;
      }

      // * 2. Sign in on the web layer using the access token we got from the native sign in
      const webAuthResult = await signInWithCredential(
        auth,
        nativeCredential as OAuthCredential
      );

      return this.authHelper.createSignInResult(
        webAuthResult,
        nativeCredential
      );
    } else {
      return Promise.reject('null nativeAuthResult');
    }
  }

  public async signInWithFacebook(): Promise<SignInResult> {
    const provider = new FacebookAuthProvider();
    const authOptions: SignInWithOAuthOptions = {
      scopes: ['email', 'public_profile']
    };

    // ? When we use the redirect authentication flow, the code below the socialSignIn() invocation does not get executed as we leave the current page
    return this.socialSignIn(provider, authOptions);
  }

  public async signInWithGoogle(): Promise<SignInResult> {
    const provider = new GoogleAuthProvider();
    const authOptions: SignInWithOAuthOptions = {
      scopes: ['email', 'profile']
    };

    // ? When we use the redirect authentication flow, the code below the socialSignIn() invocation does not get executed as we leave the current page
    return this.socialSignIn(provider, authOptions);
  }

  public async signInWithApple(): Promise<SignInResult> {
    const provider = new OAuthProvider('apple.com');
    const authOptions: SignInWithOAuthOptions = {
      scopes: ['email', 'name']
    };

    // ? When we use the redirect authentication flow, the code below the socialSignIn() invocation does not get executed as we leave the current page
    return this.socialSignIn(provider, authOptions);
  }

  public get redirectResult$(): Observable<any> {
    return this.redirectResultSubject.asObservable();
  }

  public get authState$(): Observable<AuthStateChange> {
    return this.authStateSubject.asObservable();
  }

  private getPhotoURL(signInProviderId: string, photoURL: string): string {
    // ? Default imgs are too small and our app needs a bigger image
    switch (signInProviderId) {
      case SignInProvider.facebook:
        return photoURL + '?height=400';
      case SignInProvider.twitter:
        return photoURL.replace('_normal', '_400x400');
      case SignInProvider.google:
        return photoURL.split('=')[0];
      case 'password':
        return 'https://s3-us-west-2.amazonaws.com/ionicthemes/otros/avatar-placeholder.png';
      default:
        return photoURL;
    }
  }
}
