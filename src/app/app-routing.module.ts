import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'contacts',
    pathMatch: 'full'
  },
  {
    path: 'contacts',
    loadChildren: () => import('./pages/contacts/contacts.module').then( m => m.ContactsPageModule),/*canActivate: [AuthGuard]*/
  },
  {
    path: 'contact-detail',
    loadChildren: () => import('./pages/contact-detail/contact-detail.module').then( m => m.ContactDetailPageModule),/*canActivate: [AuthGuard]*/
  },
  {
    path: 'contact-detail/:id',
      loadChildren: () => import('./pages/contact-detail/contact-detail.module').then( m => m.ContactDetailPageModule),/*canActivate: [AuthGuard]*/
  },
  {
    path: 'update-contact/:id',
    loadChildren: () => import('./pages/update-contact/update-contact.module').then( m => m.UpdateContactPageModule),/*canActivate: [AuthGuard]*/
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
