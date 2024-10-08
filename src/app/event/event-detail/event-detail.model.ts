import { ShellModel } from '../../shell/data-store';

export class EventDetailModel extends ShellModel {
  image: string = '';
  icon: string = '';
  name: string = '';
  category: string = '';
  shortDescription: string = '';
  rating: number | null = null;
  reviewsCount: number = 0;
  tags: Array<string> = new Array(3).fill('');
  fullDescription: string = '';
  openHours: Array<{
    day: string;
    open: boolean;
    hourFrom: string;
    hourTo: string;
  }> = [
    {
      day: '',
      open: true,
      hourFrom: '',
      hourTo: ''
    },
    {
      day: '',
      open: true,
      hourFrom: '',
      hourTo: ''
    },
    {
      day: '',
      open: false,
      hourFrom: '',
      hourTo: ''
    }
  ];
  location: {
    address: string;
    city: string;
    latlng: string;
    mapImage: string;
  } = { address: '', city: '', latlng: '', mapImage: '' };
  whereToStay: Array<{ picture: string; name: string; rating: number | null }> =
    [
      {
        picture: '',
        name: '',
        rating: null
      },
      {
        picture: '',
        name: '',
        rating: null
      },
      {
        picture: '',
        name: '',
        rating: null
      }
    ];
  whereToEat: Array<{ picture: string; name: string; rating: number | null }> =
    [
      {
        picture: '',
        name: '',
        rating: null
      },
      {
        picture: '',
        name: '',
        rating: null
      },
      {
        picture: '',
        name: '',
        rating: null
      }
    ];
  relatedActivities: Array<{
    picture: string;
    name: string;
    category: string;
    rating: number | null;
  }> = [
    {
      picture: '',
      name: '',
      category: '',
      rating: null
    },
    {
      picture: '',
      name: '',
      category: '',
      rating: null
    }
  ];

  constructor() {
    super();
  }
}
