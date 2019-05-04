import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import * as camera from "nativescript-camera";
import * as Platform from "platform"
import enumsModule = require('tns-core-modules/ui/enums')
import { fromAsset } from "tns-core-modules/image-source/image-source";

@Component({
  selector: 'ns-photo-component',
  templateUrl: './photo-component.component.html',
  styleUrls: ['./photo-component.component.css'],
  moduleId: module.id,
})
export class PhotoComponentComponent {


  constructor(private http: HttpClient) { }


  uploadPhoto() {
    let http = this.http;
    camera.requestPermissions().then(
      function success() {
        console.log('yes')
        let options = { width: 100, height: 100, keepAspectRatio: false, saveToGallery: true };
        let imageModule = require("tns-core-modules/ui/image");
        const format = enumsModule.ImageFormat.jpeg
        camera.takePicture(options)
          .then(function (imageAsset) {
            var image = new imageModule.Image();
            image.src = imageAsset;
            console.log(imageAsset.options.width, imageAsset.options.height)
            fromAsset(imageAsset).then((result) => {
              let base64 = result.toBase64String("jpeg", 100);
              let testUrl = 'http://b5f49f49.ngrok.io/images/';
              let options = {
                base64: base64,
                nativeLanguage: Platform.device.language
              }
              http.post(testUrl, options)
                .subscribe((data) => {
                  console.log(data);
                })


            })
          }).catch(function (err) {
            console.log("Error -> " + err.message);
          });
      },
      function failure() {
        console.log('no')
      }
    );
  }
} 
