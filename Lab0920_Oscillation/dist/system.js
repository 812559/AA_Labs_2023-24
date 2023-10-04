import Mover from "./mover.js";
import Vec2D from "./vec2d.js";
export default class System {
    parent_;
    satellites_;
    constructor(parent, satellites) {
        this.parent_ = parent;
        this.satellites_ = [];
        if (satellites) {
            const amount = satellites.amount ?? 4;
            const radius = satellites.radius ?? 20;
            const orbitalRadius = satellites.orbitalRadius ?? 100;
            const mass = satellites.mass ?? Math.PI * radius ** 2;
            const eccentricity = satellites.eccentricity ?? 0;
            const direction = satellites.direction
                ? satellites.direction == "clockwise"
                    ? -1
                    : 1
                : 1;
            for (let i = 0; i < amount; ++i) {
                const G = 6.6743e-11;
                const TAU = Math.PI * 2;
                const semiMajorAxis = Math.sqrt(orbitalRadius ** 2 / (1 - eccentricity ** 2));
                const mu = G * (parent.mass + mass);
                const speed = Math.sqrt(mu * (2 / orbitalRadius - 1 / semiMajorAxis));
                const theta = (i * TAU) / amount;
                const pos = this.parent_.position.add(Vec2D.fromAngle(theta, orbitalRadius));
                const vel = Vec2D.fromAngle(theta + (direction * Math.PI) / 2, speed).add(parent.velocity);
                this.satellites_.push(new Mover({
                    mass: mass,
                    radius: radius,
                    position: pos,
                    velocity: vel,
                    acceleration: parent.acceleration,
                }));
            }
        }
    }
    addSatellite(satellites) {
        const amount = satellites.amount ?? 4;
        const radius = satellites.radius ?? 20;
        const orbitalRadius = satellites.orbitalRadius ?? 100;
        const mass = satellites.mass ?? Math.PI * radius ** 2;
        const eccentricity = satellites.eccentricity ?? 0;
        const initialAngle = satellites.initialAngle ?? 0;
        const direction = satellites.direction
            ? satellites.direction == "clockwise"
                ? -1
                : 1
            : 1;
        for (let i = 0; i < amount; ++i) {
            const G = 6.6743e-11;
            const TAU = Math.PI * 2;
            const semiMajorAxis = Math.sqrt(orbitalRadius ** 2 / (1 - eccentricity ** 2));
            const mu = G * (this.parent_.mass + mass);
            const speed = Math.sqrt(mu * (2 / orbitalRadius - 1 / semiMajorAxis));
            const theta = initialAngle + (i * TAU) / amount;
            const pos = this.parent_.position.add(Vec2D.fromAngle(theta, orbitalRadius));
            const vel = Vec2D.fromAngle(theta + (direction * Math.PI) / 2, speed).add(this.parent_.velocity);
            this.satellites_.push(new Mover({
                mass: mass,
                radius: radius,
                position: pos,
                velocity: vel,
                acceleration: this.parent_.acceleration,
            }));
        }
    }
    get numSatellites() {
        return this.satellites_.length;
    }
    update(deltaTime, otherMovers, otherForces) {
        const movers = [this.parent_, ...this.satellites_];
        if (otherMovers)
            movers.push(...otherMovers);
        const forces = [];
        if (otherForces)
            forces.push(...otherForces);
        this.parent_.update(deltaTime, this.parent_.applyForces(movers, forces));
        for (const satellite of this.satellites_) {
            satellite.update(deltaTime, satellite.applyForces(movers, forces));
        }
    }
    render(canvas, colors) {
        const parentCLR = colors
            ? colors.parent
                ? typeof colors.parent == "string"
                    ? colors.parent
                    : colors.parent()
                : "black"
            : "black";
        this.parent_.render(canvas, parentCLR);
        for (let i = 0; i < this.satellites_.length; ++i) {
            const satellite = this.satellites_[i];
            const clr = colors
                ? colors.satellites
                    ? typeof colors.satellites == "string"
                        ? colors.satellites
                        : colors.satellites(satellite.position
                            .sub(this.parent_.position)
                            .angle(), i)
                    : "black"
                : "black";
            satellite.render(canvas, clr);
        }
    }
}
