import { Component } from '../../component.js'
import { oimo } from '../../../../3rdparty/OimoPhysics/bin/js_modules/OimoPhysics.js';
import { 
    Mesh as ThreeMesh,
    MeshBasicMaterial as ThreeMeshBasicMaterial,
    SphereGeometry as ThreeSphereGeometry,
    BoxGeometry as ThreeBoxGeometry,
    CylinderGeometry as ThreeCylinderGeometry, 
    ConeGeometry as ThreeConeGeometry
    } from '../../../../3rdparty/three.js/build/three.module.js';
import { Vector } from '../../../math/vector.js';

const OimoShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
const OimoRigidBody = oimo.dynamics.rigidbody.RigidBody;
const OimoRigidBodyConfig = oimo.dynamics.rigidbody.RigidBodyConfig;
const OimoRigidBodyType = oimo.dynamics.rigidbody.RigidBodyType;
const OimoShape = oimo.dynamics.rigidbody.Shape;
const OimoVec3 = oimo.common.Vec3;
const OimoSphereGeometry = oimo.collision.geometry.SphereGeometry;
const OimoBoxGeometry = oimo.collision.geometry.BoxGeometry;
const OimoCylinderGeometry = oimo.collision.geometry.CylinderGeometry;
const OimoConeGeometry = oimo.collision.geometry.ConeGeometry;
const OimoCapsuleGeometry = oimo.collision.geometry.CapsuleGeometry;

class RigidBody extends Component {
    #geometry = null;
    #shapeConfig = null;
    #rigidBodyConfig = null;
    #rigidBody = null;
    #shape = null;

    #debugGeometry = null;
    #debugMesh = null;
    #debugMeshMat = null;

	#linVel = new Vector(0, 0, 0);
	#angVel = new Vector(0, 0, 0);

    constructor(init) {
        super(init);

        this.#geometry = null;
        const radius = init.init?.radius ?? 0.5;
        const halfHeight = init.init?.halfHeight ?? 0.5;
        const halfExtents = init.init?.halfExtents;
        
        switch(init.init?.shape) {
            case 'sphere':
                this.#geometry = new OimoSphereGeometry(radius);
                break;
            case 'box':
                this.#geometry = new OimoBoxGeometry(new OimoVec3(halfExtents?.x ?? 0.5, halfExtents?.y ?? 0.5, halfExtents?.z ?? 0.5));
                break;
            case 'cylinder':
                this.#geometry = new OimoCylinderGeometry(radius, halfHeight);
                break;
            case 'cone':
                this.#geometry = new OimoConeGeometry(radius, halfHeight);
                break;
            case 'capsule':
                this.#geometry = new OimoCapsuleGeometry(radius, halfHeight);
                break;
            default:
                console.log('Warning: RigidBody with unspecified init.init.rigidBodyShape!');
                this.#geometry = new OimoSphereGeometry(radius);
                break;
        }

        this.#shapeConfig = new OimoShapeConfig();
		this.#shapeConfig.geometry = this.#geometry;

		this.#rigidBodyConfig = new OimoRigidBodyConfig();
		this.#rigidBodyConfig.type = OimoRigidBodyType.STATIC;
        switch(init.init?.type) {
            case 'dynamic':
                this.#rigidBodyConfig.type = OimoRigidBodyType.DYNAMIC;
                break;
            case 'kinematic':
                this.#rigidBodyConfig.type = OimoRigidBodyType.KINEMATIC;
                break;
            case 'static':
                this.#rigidBodyConfig.type = OimoRigidBodyType.STATIC;
                break;
        }

		this.#rigidBodyConfig.position = new OimoVec3(0, 0, 0);

		this.#rigidBody = new OimoRigidBody(this.#rigidBodyConfig);
        this.#shape = new OimoShape(this.#shapeConfig);
		this.#rigidBody.addShape(this.#shape);

		this.world.physics.addRigidBody(this.#rigidBody);

        this.#debugGeometry = null;

        switch(init.init?.shape) {
            case 'sphere':
                this.#debugGeometry = new ThreeSphereGeometry(radius);
                break;
            case 'box':
                this.#debugGeometry = new ThreeBoxGeometry((halfExtents?.x ?? 0.5) * 2, (halfExtents?.y ?? 0.5) * 2, (halfExtents?.z ?? 0.5) * 2);
                break;
            case 'cylinder':
                this.#debugGeometry = new ThreeCylinderGeometry(radius, halfHeight * 2);
                break;
            case 'cone':
                this.#debugGeometry = new ThreeConeGeometry(radius, halfHeight * 2);
                break;
            case 'capsule':
                this.#debugGeometry = new ThreeCylinderGeometry(radius, halfHeight * 2);
                break;
            default:
                this.#debugGeometry = new ThreeSphereGeometry(radius);
                break;
        }

        this.#debugMeshMat = new ThreeMeshBasicMaterial({color: 0xff0000, wireframe: true});
        this.#debugMesh = new ThreeMesh(this.#debugGeometry, this.#debugMeshMat);
        this.world.scene.add(this.#debugMesh);
    }

    fromJSON(json) {
		super.fromJSON(json);
		
		this.#linVel.x = json.linVel_x ?? this.#linVel.x;
		this.#linVel.y = json.linVel_y ?? this.#linVel.y;
		this.#linVel.z = json.linVel_z ?? this.#linVel.z;

		this.#angVel.x = json.angVel_x ?? this.#angVel.x;
		this.#angVel.y = json.angVel_y ?? this.#angVel.y;
		this.#angVel.z = json.angVel_z ?? this.#angVel.z;
	}

	toJSON() {
		const json = super.toJSON();

		json.linVel_x = this.#linVel.x;
		json.linVel_y = this.#linVel.y;
		json.linVel_z = this.#linVel.z;

		json.angVel_x = this.#angVel.x;
		json.angVel_y = this.#angVel.y;
		json.angVel_z = this.#angVel.z;

		return json;
	}

    static get replicatedProperties() {
        return {
            linVel_x : {interp: 'linear'},
            linVel_y : {interp: 'linear'},
            linVel_z : {interp: 'linear'},
            angVel_x : {interp: 'deg'},
            angVel_y : {interp: 'deg'},
            angVel_z : {interp: 'deg'}
        }
    }

    prePhysTick() {
        if(this.#rigidBody != null) {
            const position = this.position;
            this.#rigidBody.setPosition(new OimoVec3(position.x, position.y, position.z));

            const rotation = this.rotation;
            this.#rigidBody.setRotationXyz(new OimoVec3(rotation.x, rotation.y, rotation.z));

            const linearVelocity = this.linearVelocity;
            this.#rigidBody.setLinearVelocity(new OimoVec3(linearVelocity.x, linearVelocity.y, linearVelocity.z));

            const angularVelocity = this.angularVelocity;
            this.#rigidBody.setAngularVelocity(new OimoVec3(angularVelocity.x, angularVelocity.y, angularVelocity.z));
        }
    }

    postPhysTick() {
        if(this.#rigidBody != null) {
            const physPosition = this.#rigidBody.getPosition();
            this.relativePosition = new Vector(physPosition.x, physPosition.y, physPosition.z);

            const physRotation = this.#rigidBody.getRotation().toEulerXyz();
            this.relativeRotation = new Vector(physRotation.x, physRotation.y, physRotation.z);

            const physLinearVelocity = this.#rigidBody.getLinearVelocity();
            this.linearVelocity = new Vector(physLinearVelocity.x, physLinearVelocity.y, physLinearVelocity.z);

            const physAngularVelocity = this.#rigidBody.getAngularVelocity();
            this.angularVelocity = new Vector(physAngularVelocity.x, physAngularVelocity.y, physAngularVelocity.z);
        }
    }

    tick(dt) {
        super.tick(dt);
        if(this.#debugMesh != null) {
            const position = this.position;
            this.#debugMesh.position.set(position.x, position.y, position.z);

            const rotation = this.rotation;
            this.#debugMesh.rotation.set(rotation.x, rotation.y, rotation.z);

            const scale = this.scale;
            this.#debugMesh.scale.set(scale.x, scale.y, scale.z);
        }
    }

    get linearVelocity() {
        return this.#linVel;
    }

    set linearVelocity(linVel) {
        this.#linVel = linVel;
    }

    get angularVelocity() {
        return this.#angVel;
    }

    set angularVelocity(angVel) {
        this.#angVel = angVel;
    }

}

export { RigidBody };
