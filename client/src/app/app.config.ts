import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import {
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
import { errorInterceptor } from './_interceptors/error.interceptor';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';
import { GALLERY_CONFIG, GalleryConfig } from 'ng-gallery';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { loadingInterceptor } from './_interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])
    ),
    provideToastr({ positionClass: 'toast-bottom-right' }),
    provideAnimations(),
    {
      provide: GALLERY_CONFIG,
      useValue: {
        autoHeight: false,
        imageSize: 'cover',
      } as GalleryConfig,
    },
    provideAnimationsAsync(),
  ],
};
