import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { Accuiel } from './fond/accuiel/accuiel';
import { Login } from './fond/login/login';
import { FormationComponent } from './fond/formation/formation';
import { AdminDasbord } from './fond/admin-dasbord/admin-dasbord';
import { CreateForma } from './fond/create-forma/create-forma';
import { ActualiteComponent } from './fond/actualite/actualite';
import { ActualiteListComponent } from './fond/actualite-list/actualite-list';
import { FormationDetailComponent } from './fond/formation-detail/formation-detail';
import { InscriptionComponent } from './inscription/inscription';
import { ListeInscritsComponent } from './liste-inscrits/liste-inscrits';
import { GestionCandidatsComponent } from './gestion-candidats/gestion-candidats';
import { AproposComponent } from './apropos/apropos';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: Accuiel },
      { path: 'formation', component: FormationComponent },
      { path: 'login', component: Login },
      { path: 'actualites', component: ActualiteListComponent },
      { path: 'inscription/:id', component: InscriptionComponent },
      { path: 'liste-inscrits/:id', component: ListeInscritsComponent },
      { path: 'apropos', component: AproposComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDasbord },
      { path: 'formation', component: FormationComponent },
      { path: 'create-forma', component: CreateForma }, // ✅ ICI
      { path: 'actualite', component: ActualiteComponent },
      { path: 'actualites', component: ActualiteListComponent },
      { path: 'formation/:id', component: FormationDetailComponent },
      { path: 'liste-inscrits/:id', component: ListeInscritsComponent },
      { path: 'gestion-candidats', component: GestionCandidatsComponent },

      // ✅ ICI
      // ajoute les autres pages admin ici
      // { path: 'projets', component: ProjetsComponent },
      // { path: 'benevoles', component: BenevolesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];


// {
//   path: 'admin',
//   component: AdminLayoutComponent,
//   children: [
//     { path: 'dashboard', component: AdminDasbord },
//     { path: 'formation', component: FormationComponent },
//     { path: 'projets', component: ProjetsComponent },
//     { path: 'benevoles', component: BenevolesComponent },
//     { path: 'participants', component: ParticipantsComponent },
//     { path: 'financements', component: FinancementsComponent },
//     { path: 'stats', component: StatsComponent },
//     { path: 'parametres', component: ParametresComponent },
//     { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
//   ]
// }

