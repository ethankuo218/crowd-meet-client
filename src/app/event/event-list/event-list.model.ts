import { ShellModel } from '../../shell/data-store';

export class ItemModel {
  image: string = '';
  icon: string = '';
  name: string = '';
  description: string = '';
  category: string = '';
  address: string = '';
  rating: number | null = null;
  reviewsCount: number = 0;
  slug: string = '';
}

export class EventListModel extends ShellModel {
  items: Array<ItemModel> = [
    new ItemModel(),
    new ItemModel(),
    new ItemModel(),
    new ItemModel()
  ];

  ssr_state: any;

  constructor() {
    super();
  }
}
