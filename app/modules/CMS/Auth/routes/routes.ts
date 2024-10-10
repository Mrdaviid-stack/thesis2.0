import router from "@adonisjs/core/services/router";
import SigninsController from "../controllers/signins_controller.js";
import { middleware } from "#start/kernel";

export default function AuthRoutes() {
    router.group(() => {
        
        router.get('/sign-in', [SigninsController, 'index']).as('signin.index').use(middleware.guest())
        router.post('/sign-in', [SigninsController, 'signin']).as('signin.signin').use(middleware.guest())
        router.post('/sign-out', [SigninsController, 'signout']).as('signout.signout').use(middleware.auth())

    }).prefix("/auth");
}