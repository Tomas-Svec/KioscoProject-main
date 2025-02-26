import './polyfills.server.mjs';
import{a as w}from"./chunk-5QU7XVY4.mjs";import{a as P,c as N,d as I,e as O,f as T,g as E,n as L,p as F,q as D}from"./chunk-TYFGRF4Y.mjs";import{a as k}from"./chunk-NG6GRI4F.mjs";import{Ba as h,G as f,Ia as r,Ka as C,Ma as c,Na as p,Oa as u,Qa as y,W as v,aa as l,ba as d,la as b,pa as x,qb as _,sb as S,ta as e,ua as o,ub as M,za as g}from"./chunk-RUC5EUIT.mjs";import"./chunk-5XUXGTUW.mjs";function j(s,a){if(s&1&&(e(0,"div",14),r(1),o()),s&2){let n=h();l(),C(" ",n.errorMessage," ")}}var R=class s{constructor(a,n,t,m){this.themeService=a;this.authService=n;this.routeNavigator=t;this.platformId=m}nombre="";apellido="";email="";password="";errorMessage="";onSubmit(){M(this.platformId)?this.authService.login(this.email,this.password).subscribe({next:a=>{this.authService.saveUserData(a),this.routeNavigator.navigateToDashboard()},error:a=>{this.errorMessage="Credenciales inv\xE1lidas"}}):console.error("localStorage no est\xE1 disponible en el servidor.")}goToRegister(){this.routeNavigator.navigateToRegister()}static \u0275fac=function(n){return new(n||s)(d(w),d(k),d(D),d(v))};static \u0275cmp=f({type:s,selectors:[["app-login"]],standalone:!0,features:[y],decls:21,vars:3,consts:[[1,"min-h-screen","flex","items-center","justify-center","bg-gray-100","dark:bg-gray-900"],[1,"login-container","bg-white","dark:bg-gray-800","p-8","rounded-lg","shadow-md","w-full","max-w-md"],[1,"text-2xl","font-bold","text-center","mb-6","text-gray-800","dark:text-white"],[1,"space-y-4",3,"ngSubmit"],[1,"form-group"],["for","email",1,"block","text-sm","font-medium","text-gray-700","dark:text-gray-300"],["type","email","id","email","name","email","placeholder","ejemplo@correo.com","required","",1,"mt-1","block","w-full","px-3","py-2","border","border-gray-300","rounded-md","shadow-sm","focus:outline-none","focus:ring-indigo-500","focus:border-indigo-500","sm:text-sm","dark:bg-gray-700","dark:border-gray-600","dark:text-white",3,"ngModelChange","ngModel"],["for","password",1,"block","text-sm","font-medium","text-gray-700","dark:text-gray-300"],["type","password","id","password","name","password","placeholder","Contrase\xF1a","required","",1,"mt-1","block","w-full","px-3","py-2","border","border-gray-300","rounded-md","shadow-sm","focus:outline-none","focus:ring-indigo-500","focus:border-indigo-500","sm:text-sm","dark:bg-gray-700","dark:border-gray-600","dark:text-white",3,"ngModelChange","ngModel"],["class","error text-red-500 text-sm text-center",4,"ngIf"],["type","submit",1,"w-full","py-2","px-4","bg-indigo-600","hover:bg-indigo-700","text-white","font-semibold","rounded-md","shadow-sm","focus:outline-none","focus:ring-2","focus:ring-offset-2","focus:ring-indigo-500","transition-colors"],[1,"register-link","mt-4","text-center"],[1,"text-gray-600","dark:text-gray-400"],[1,"link","text-indigo-600","hover:underline","cursor-pointer","ml-2",3,"click"],[1,"error","text-red-500","text-sm","text-center"]],template:function(n,t){n&1&&(e(0,"div",0)(1,"div",1)(2,"h2",2),r(3," Iniciar Sesi\xF3n "),o(),e(4,"form",3),g("ngSubmit",function(){return t.onSubmit()}),e(5,"div",4)(6,"label",5),r(7," Email "),o(),e(8,"input",6),u("ngModelChange",function(i){return p(t.email,i)||(t.email=i),i}),o()(),e(9,"div",4)(10,"label",7),r(11," Contrase\xF1a "),o(),e(12,"input",8),u("ngModelChange",function(i){return p(t.password,i)||(t.password=i),i}),o()(),b(13,j,2,1,"div",9),e(14,"button",10),r(15," Iniciar Sesi\xF3n "),o()(),e(16,"div",11)(17,"span",12),r(18,"\xBFNo tienes una cuenta?"),o(),e(19,"a",13),g("click",function(){return t.goToRegister()}),r(20," Reg\xEDstrate aqu\xED "),o()()()()),n&2&&(l(8),c("ngModel",t.email),l(4),c("ngModel",t.password),l(),x("ngIf",t.errorMessage))},dependencies:[_,S,F,E,P,N,I,L,T,O],styles:[".login-container[_ngcontent-%COMP%]{background-color:var(--background-color);color:var(--text-color);padding:20px;border-radius:10px}body.dark-mode[_ngcontent-%COMP%]   .login-container[_ngcontent-%COMP%]{border:1px solid #ffffff50}.error[_ngcontent-%COMP%]{color:red;margin-top:10px}.form-group[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:18px;color:#007bff}.form-group[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:hover{color:#0056b3}.register-link[_ngcontent-%COMP%]{margin-top:20px;text-align:center;font-size:14px;color:#555}.register-link[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]{color:#007bff;text-decoration:none;font-weight:700}.register-link[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]:hover{text-decoration:underline}"]})};export{R as LoginComponent};
