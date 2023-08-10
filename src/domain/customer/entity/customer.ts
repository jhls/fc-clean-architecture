import EventDispatcher from "../../@shared/event/event-dispatcher";
import ChangeAddressEvent from "../event/change-address.event";
import CustomerCreatedEvent from "../event/customer-created.event";
import Address from "../value-object/address";


   
export default class Customer{

    private _id: string;
    private _name: string;
    private _address!: Address;
	
	

	private _active: boolean = false;
	private _rewardPoints: number =0;

    constructor(id: string, name: string, eventDispatcher:EventDispatcher = null) {
        this._id = id;
        this._name = name;
		this.validate();
		
		if(eventDispatcher !==null){
			const customerCreatedEvent: CustomerCreatedEvent = new CustomerCreatedEvent([]);
			eventDispatcher.notify(customerCreatedEvent);
		}
		
    }

	validate(){
		if(this._id.length === 0){
			throw new Error("Id is required")
		}
		if(this._name.length === 0 ){
			throw new Error("Name is required")
		}
	}

	changeName(name: string){
		this._name = name;
		this.validate();
	}

	activate() {
		if(this._address === undefined){
			throw new Error("Address is mandatory to activate a customer");
		}

		this._active = true;
	}

	deactivate(){
		this._active = false;
	}

	set Address(address : Address){
		this._address = address;
	}

	public get name(): string {
		return this._name;
	}

	isActive(): boolean{
		return this._active;
	}

	get rewardPoints():number{
		return this._rewardPoints;
	}

	addRewardPoints(points:number){
		this._rewardPoints +=points;
	}

	changeAddress(address: Address, eventDispatcher:EventDispatcher = null){
		this._address  = address;
		if(eventDispatcher !==null){
			const customerCreatedEvent: ChangeAddressEvent = new ChangeAddressEvent({
				id: this._id,
				nome: this._name,
				endereco: this._address.toString(),
			});
			eventDispatcher.notify(customerCreatedEvent);
		}
	}
	 /**
     * Getter id
     * @return {string}
     */
	 public get id(): string {
		return this._id;
	}

	public get Address(): Address {
		return this._address;
	}


}