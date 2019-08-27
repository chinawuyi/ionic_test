"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * Generated class for the ProblemdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ProblemdetailsPage = (function () {
    function ProblemdetailsPage(navCtrl, navParams, LS) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.LS = LS;
        this.problem = {};
        this.problem = this.navParams.data;
    }
    ProblemdetailsPage.prototype.callPhone = function (tel) {
        this.LS.callPhone(tel);
    };
    return ProblemdetailsPage;
}());
ProblemdetailsPage = __decorate([
    core_1.Component({
        selector: 'page-problemdetails',
        templateUrl: 'problemdetails.html',
    })
], ProblemdetailsPage);
exports.ProblemdetailsPage = ProblemdetailsPage;
