export default class System {
    constructor() { }
    ;
    /**
     * Remove this system from an environment
     * @param environment the environment this system belongs to
     */
    removeFrom(environment) {
        if (environment.includes(this))
            environment.splice(environment.indexOf(this), 1);
    }
}
