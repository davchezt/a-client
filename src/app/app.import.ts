// Provider
import { Api } from '../providers/api/api';
import { Common } from '../providers/common/common';
import { WeatherProvider } from '../providers/weather/weather';
import { LogerProvider } from '../providers/loger/loger';
import { SocketProvider } from '../providers/socket/socket';
import { DataProvider } from '../providers/data/data';

// Components
import { TimelineComponent } from '../components/timeline/timeline';
import { TimelineTimeComponent } from '../components/timeline/timeline';
import { TimelineItemComponent } from '../components/timeline/timeline';

// Pages
import { HomePage } from '../pages/home/home';
import { WellcomePage } from '../pages/wellcome/wellcome';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { TimelinePage } from '../pages/timeline/timeline';
import { DashboardTabsPage } from '../pages/dashboard-tabs/dashboard-tabs';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ListsTabsPage } from '../pages/lists-tabs/lists-tabs';
import { NoTabsPage } from '../pages/no-tabs/no-tabs';
import { SettingsPage } from '../pages/settings/settings';
import { ProfilePage } from '../pages/profile/profile';
import { TodoListPage } from '../pages/todo-list/todo-list';
import { GroceryListPage } from '../pages/grocery-list/grocery-list';
import { UploadFilePage } from '../pages/upload-file/upload-file';
import { LocationTrackerPage } from '../pages/location-tracker/location-tracker';
import { CalendarPage } from '../pages/calendar/calendar';
import { CalDetailsPage } from '../pages/cal-details/cal-details';
import { PopoverPage } from '../pages/popover/popover';
import { PopoverDashboardPage } from '../pages/popover-dashboard/popover-dashboard';
import { ChatPage } from '../pages/chat/chat';
import { DeleteModalPage } from '../pages/delete-modal/delete-modal';
import { AddLahanPage } from '../pages/add-lahan/add-lahan';
import { AddKomoditasPage } from '../pages/add-komoditas/add-komoditas';
import { SearchPage } from '../pages/search/search';
import { ProfilePicturePage } from '../pages/profile-picture/profile-picture';
import { ProfileIdPage } from '../pages/profile-id/profile-id';
import { ProfileEditPage } from '../pages/profile-edit/profile-edit';
import { ProfileAlamatPage } from '../pages/profile-alamat/profile-alamat';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { LahanPage } from '../pages/lahan/lahan';
import { EditLahanPage } from '../pages/edit-lahan/edit-lahan';
import { EditKomoditasPage } from '../pages/edit-komoditas/edit-komoditas';
import { RoomListPage } from '../pages/room-list/room-list';
import { RoomAddPage } from '../pages/room-add/room-add';
import { RoomEditPage } from '../pages/room-edit/room-edit';
import { RoomDeletePage } from '../pages/room-delete/room-delete';
import { RoomChatPage } from '../pages/room-chat/room-chat';

// Natives
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Calendar } from '@ionic-native/calendar';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { OnlineListPage } from '../pages/online-list/online-list';

export const NATIVES = [
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    Geolocation,
    BackgroundGeolocation,
    NativeGeocoder,
    GoogleMaps,
    Calendar,
    ScreenOrientation
]

export const PROVIDERS = [
    Api,
    Common,
    WeatherProvider,
    LogerProvider,
    SocketProvider,
    DataProvider
];

export const COMPONENTS = [
    TimelineComponent,
    TimelineTimeComponent,
    TimelineItemComponent
];

export const PAGES = [
    WellcomePage,
    TimelinePage,
    TutorialPage,
    DashboardTabsPage,
    LoginPage,
    RegisterPage,
    DashboardPage,
    ListsTabsPage,
    NoTabsPage,
    SettingsPage,
    ProfilePage,
    TodoListPage,
    GroceryListPage,
    UploadFilePage,
    LocationTrackerPage,
    CalendarPage,
    CalDetailsPage,
    PopoverPage,
    PopoverDashboardPage,
    ChatPage,
    DeleteModalPage,
    AddLahanPage,
    HomePage,
    SearchPage,
    ProfilePicturePage,
    ProfileIdPage,
    ProfileEditPage,
    ProfileAlamatPage,
    ContactUsPage,
    LahanPage,
    EditLahanPage,
    EditKomoditasPage,
    AddKomoditasPage,
    OnlineListPage,
    RoomListPage,
    RoomAddPage,
    RoomEditPage,
    RoomDeletePage,
    RoomChatPage
]