import {Component, OnInit, ViewChild} from '@angular/core'
import * as tf from '@tensorflow/tfjs'
import { DrawableDirective } from './drawable.directive'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  predictions: number[]
  model: tf.Model
  linearModel: tf.Sequential
  @ViewChild(DrawableDirective) canvas;
  private prediction: number;

  async ngOnInit() {
    await this.loadModel()
    await this.trainNewModel()
  }

  private async trainNewModel() {
    this.linearModel = tf.sequential()
    this.linearModel.add(tf.layers.dense({units: 1, inputShape: [1]}))
    this.linearModel.compile({loss: 'meanSquaredError', optimizer: 'sgd'})

    const xs = tf.tensor1d([3.2, 4.4, 5.5, 6.71, 6.98, 7.168, 9.779, 6.182, 7.59, 2.16, 7.042, 10.71, 5.313, 7.97, 5.654, 9.7, 3.11])
    const ys = tf.tensor1d([1.6, 2.7, 2.9, 3.19, 1.684, 2.53, 3.366, 2.596, 2.53, 1.22, 2.87, 3.45, 1.65, 2.904, 2.42, 2.4, 1.31])

    await this.linearModel.fit(xs, ys)

    console.log('model trained')
  }

  linearPrediction(val: number){
    const output = this.linearModel.predict(tf.tensor2d([val], [1, 1])) as tf.Tensor
    this.prediction = Array.from(output.dataSync())[0]
  }


  private async loadModel() {
    this.model = await tf.loadModel('/assets/model.json')
  }

  async predict(imageData: ImageData) {
    const pred = tf.tidy(() => {
      let img = tf.fromPixels(imageData, 1)
      img = img.reshape([1, 28, 28, 1] as any)
      img = tf.cast(img, 'float32')
      const output = this.model.predict(img) as tf.Tensor
      // Save predictions on the component
      this.predictions = Array.from(output.dataSync());
    })
  }
}
