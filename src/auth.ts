import authController from "./internals/singletons/Auth";

export default () => ({
    user: authController.getCurrentUser.bind(authController),
    logout: authController.logout.bind(authController),
});
