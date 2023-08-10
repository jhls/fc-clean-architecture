export default class OrderItem{

    private _id: string;
    private _productId: string;
    private _name: string;
    private _price: number;
    private _quantity: number;
    private _total: number;
   
   


	constructor(id: string, name: string, price: number, productId:string, quantity:number) {
		this._id = id;
		this._name = name;
		this._price = price;
        this._productId = productId;
        this._quantity = quantity;
        this._total = this.total();
        this.validate();
	}

    public  validate():boolean{

        if(this._quantity <= 0){
            throw new Error("Quantity must be greater than 0")
        }
        return true;
    }

    public get price(): number {
        return this._price;
    }

    public get quantity():number{
        return this._quantity;
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get productId(): string {
        return this._productId;
    }

    total(): number{
        return this._price * this._quantity;
    }
}