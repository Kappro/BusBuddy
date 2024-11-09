import { DOCUMENT, NgStyle, NgFor } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { RouterLink } from '@angular/router';
import {
  AvatarComponent,
  ContainerComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
  ColDirective,
  CarouselCaptionComponent,
  CarouselComponent,
  CarouselControlComponent,
  CarouselIndicatorsComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  ThemeDirective,
  ImgModule,
  ModalModule,
  ButtonModule,
  TableModule,
  UtilitiesModule
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

/**
 * Dashboard component for drivers that displays announcements.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ChartjsComponent, IconDirective, AvatarComponent, NgStyle,
    ButtonDirective,
    ButtonGroupComponent,
    ContainerComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    ColComponent,
    FormCheckLabelDirective,
    GutterDirective,
    ProgressBarDirective,
    ProgressComponent,
    RowComponent,
    TableDirective,
    TextColorDirective,
    CarouselCaptionComponent,
    CarouselComponent,
    CarouselControlComponent,
    CarouselIndicatorsComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    ThemeDirective,
    ColDirective,
    NgFor,
    ImgModule,
    ModalModule,
    ButtonModule,
    TableModule,
    UtilitiesModule
  ]
})
export class DashboardComponent implements OnInit {
  /**
   * @ignore
   */
  constructor() { }

  /**
   * @ignore
   */
  slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '', fullAnnSrc: '' });
  /**
   * @ignore
   */
  public displayAnn:boolean = false;
  /**
   * @ignore
   */
  public imgSrc:string = '';

  /**
   * Loads in all current announcements on start.
   */
  ngOnInit(): void {
    this.slides[0] = {
      id: 1,
      src: './assets/images/one.jpg',
      title: 'Bus and train fare adjustment',
      subtitle: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      fullAnnSrc: './assets/images/one_full.jpg'
    };
    this.slides[1] = {
      id: 2,
      src: './assets/images/two.jpg',
      title: 'Great Eastern Women\'s run route diversion',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      fullAnnSrc: './assets/images/two_full.jpg'
    };
    this.slides[2] = {
      id: 3,
      src: './assets/images/three.jpg',
      title: 'Extension of operational hours on Eve of Deepavali',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
      fullAnnSrc: './assets/images/three_full.jpg'
    };
  }

  /**
   * Provides function to display announcement.
   * @param {number} index Index of announcement to be displayed.
   */
  clickAnn(index:number) {
    this.displayAnn = true;
    this.imgSrc = this.slides[index].fullAnnSrc;
  }

  /**
   * Provides function to close active announcement.
   */
  closeAnn() {
    this.displayAnn = false;
  }

}
