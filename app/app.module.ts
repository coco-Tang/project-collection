import { IonicStorageModule } from '@ionic/storage';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, RequestOptions } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

/*****************************************************
 * 启动app
 *****************************************************/
import { ChemicApp } from './app.component';

/*****************************************************
 * 工具类
 *****************************************************/
import { Helper } from '../utils/helper';
import { FileTransferTool } from '../utils/file-transfer';
import { DatePipe } from '../pipes/date.pipe';
import { CurrencyPipe } from '../pipes/currency.pipe';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
/*****************************************************
 * 组件
 *****************************************************/
import { HomePage } from '../pages/home/home';
import { PartnerPage } from '../pages/partner/partner';
import { StoreProdutsPage } from '../pages/partner/products/products';
import { TabsPage } from '../pages/tabs/tabs';
import { UserCenterPage } from '../pages/user-center/user-center';
import { NoticePage } from '../pages/notice/notice';
import { ProfilePage } from '../pages/user-center/profile/profile';
import { SettingsPage } from '../pages/user-center/settings/settings';
import { AboutPage } from '../pages/user-center/settings/about/about';
import { EnterpriseListPage } from '../pages/user-center/enterprise/enterprise-list';
import { LoginPage } from '../pages/auth/login/login';
import { RegisterPage } from '../pages/auth/register/register'
import { FollowPage } from '../pages/follow/follow';
import { ResourceDetailPage } from '../pages/resource/resource-detail/resource-detail'
import { ResourceListPage } from '../pages/resource/list/resource-list';
import { ChatPage } from '../pages/enquiry/chat/chat';
import { OrderPage } from '../pages/order/order-detail/order';
import { EnquiryPage } from '../pages/enquiry/enquiry';
import { EnquiryDetailPage } from '../pages/enquiry/enquiry-detail/enquiry-detail'
import { EnquiryAdjustListPage } from '../pages/enquiry/adjust/list/enquiry-adjust-list';
import { EnquiryAdjustPage } from '../pages/enquiry/adjust/enquiry-adjust';
import { AddressListPage } from '../pages/address/address-list/address-list';
import { AddressFormPage } from '../pages/address/address-form/address-form';
import { OrderListPage } from '../pages/order/order-list/order-list';
import { EnterpriseFormPage } from '../pages/user-center/enterprise/enterprise-form/enterprise-form';
import { ProtocolPage } from '../pages/user-center/enterprise/protocol/protocol';
import { CertificationMaterialPage } from '../pages/user-center/enterprise/certification-material/certification-material';
import { CommonDialog } from '../components/common-dialog/common-dialog';
import { CommonConfirm } from '../components/common-confirm/common-confirm';
import { UpdateModal } from '../components/updateModal/update';
import { DownloadModal } from '../components/updateModal/download';
import { CityPickerModal } from '../pages/home/city-picker-modal/city-picker-modal'
import { UpdateCountModal } from '../components/update-count-modal/update-count-modal'
/*****************************************************
 * 业务相关服务
 *****************************************************/
import { CategoryService } from '../pages/category/category.service';

/*****************************************************
 * 公共service
 *****************************************************/
import { AuthService } from '../services/auth.service';
import { UserService } from '../pages/user-center/user.service';
import { OrderService } from '../pages/order/order.service';
import { ResourceService } from '../pages/resource/resource.service';
import { HttpService } from '../services/http.service';
import { DefaultRequestOptions } from '../services/request-options.service';
import { FollowService } from '../pages/follow/follow.service';
import { EnquiryService } from '../pages/enquiry/enquiry.service';
import { AddressService } from '../pages/address/address.service';
import { UpdateService } from '../services/update.service';
import { RegisterService } from '../pages/auth/register/register.service';
import { HomeService } from '../pages/home/home.service'
import { NoticeService } from '../pages/notice/notice.service';
import { EnterpriseService } from '../pages/user-center/enterprise/enterprise.service';
import { NotificationService } from '../services/notification.service'
/*****************************************************
 * Native 服务
 *****************************************************/
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { AppVersion } from '@ionic-native/app-version';
import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';
import { Crop } from '@ionic-native/crop';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { JPush } from '@jiguang-ionic/jpush';

let components = [
  HomePage,
  UserCenterPage,
  PartnerPage,
  StoreProdutsPage,
  OrderListPage,
  NoticePage,
  ProfilePage,
  SettingsPage,
  AboutPage,
  EnterpriseListPage,
  TabsPage,
  OrderPage,
  ResourceDetailPage,
  ResourceListPage,
  LoginPage,
  RegisterPage,
  FollowPage,
  ChatPage,
  EnquiryPage,
  EnquiryDetailPage,
  EnquiryAdjustListPage,
  AddressListPage,
  AddressFormPage,
  EnquiryAdjustPage,
  ProtocolPage,
  EnterpriseFormPage,
  CertificationMaterialPage,
  CommonDialog,
  UpdateModal,
  DownloadModal,
  CityPickerModal,
  UpdateCountModal,
  CommonConfirm,
]

@NgModule({
  declarations: [
    ChemicApp,
    DatePipe,
    CurrencyPipe,
    SafeHtmlPipe,
    ...components
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(ChemicApp, {
      platforms: {
        ios: {
          backButtonText: "返回",//统一配置后退文案
        }
      },
      tabsHideOnSubPages: true,//统一配置二级页面时tab是否隐藏
    }),
    IonicStorageModule.forRoot({
      name: '__1chemicdb',//配置app缓存存储位置
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ChemicApp,
    ...components
  ],
  providers: [
    Helper,
    FileTransferTool,
    StatusBar,
    InAppBrowser,
    Crop,
    File,
    Camera,
    FilePath,
    FileOpener,
    FileTransfer,
    FileTransferObject,
    AppVersion,
    HttpService,
    AuthService,
    UserService,
    NoticeService,
    OrderService,
    ResourceService,
    EnquiryService,
    SplashScreen,
    CategoryService,
    FollowService,
    AddressService,
    UpdateService,
    EnterpriseService,
    RegisterService,
    HomeService,
    Geolocation,
    Keyboard,
    PhotoViewer,
    NotificationService,
    JPush,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: RequestOptions, useClass: DefaultRequestOptions }
  ]
})
export class AppModule { }
