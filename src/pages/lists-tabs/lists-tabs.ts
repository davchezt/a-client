import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TodoListPage } from '../todo-list/todo-list';
import { GroceryListPage } from '../grocery-list/grocery-list';

@Component({
  selector: 'page-lists-tabs',
  templateUrl: 'lists-tabs.html',
})
export class ListsTabsPage {

  tab1 = TodoListPage;
  tab2 = GroceryListPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

}
