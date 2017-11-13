import { Injectable } from "@angular/core";
import {
    AlertController, Loading,
    LoadingController, Toast, ToastController,
    ActionSheetController
} from "ionic-angular";

@Injectable()
export class Utils {

    private loading: Loading

    constructor(private alrtCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private actionSheetCtrl: ActionSheetController) { }

    public presentAlert(title: string,
        message: string,
        buttons: [{}],
        subtitle?: string,
        enableBackdropDismiss?: boolean,
        inputs?: [{}]): void {

        let alrt = this.alrtCtrl.create({
            title: title,
            subTitle: subtitle,
            message: message,
            buttons: buttons,
            enableBackdropDismiss: enableBackdropDismiss,
            inputs: inputs
        })
        alrt.present()

    }

    public presentToast(message: string, duration?: number,
        dissmissOnPageChange?: boolean,
        position?: string,
        showCloseButton?: boolean,
        closeButtonText?: string): void {

        let toast = this.toastCtrl.create({
            message: message,
            position: position,
            dismissOnPageChange: dissmissOnPageChange,
            duration: duration,
            showCloseButton: showCloseButton,
            closeButtonText: closeButtonText
        })
        toast.present()
    }

    public presentLoading(content: string, duration?: number,
        dissmissOnPageChange?: boolean,
        enableBackDropDismiss?: boolean,
        showBackDrop?: boolean,
        spinner?: string): void {
        this.loading = this.loadingCtrl.create({
            content: content,
            dismissOnPageChange: dissmissOnPageChange,
            duration: duration,
            enableBackdropDismiss: enableBackDropDismiss,
            showBackdrop: showBackDrop,
            spinner: spinner
        })
        this.loading.present()
    }

    public dismissLoading(): void {
        this.loading.dismiss()
    }

    public presentActionSheet(buttons: [{}], title: string, subtitle?: string,
        enableBackdropDismiss?: boolean): void {
        let actionCtrl = this.actionSheetCtrl.create({
            buttons: buttons,
            subTitle: subtitle,
            title: title,
            enableBackdropDismiss: enableBackdropDismiss
        })
        actionCtrl.present()
    }
}