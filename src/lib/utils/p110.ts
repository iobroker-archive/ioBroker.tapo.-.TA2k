import { EnergyUsage } from "./energyUsage";
import P100 from "./p100";
import { ConsumptionInfo } from "./types";

export default class P110 extends P100 {

  private _consumption!:ConsumptionInfo;

  constructor(
    public readonly log: any,
    public readonly ipAddress: string,
    public readonly email: string,
    public readonly password: string,
    public readonly timeout: number,
  ) {
    super(log, ipAddress, email, password, timeout);
    this.log.info("Constructing P110 on host: " + ipAddress);
  }

  async getEnergyUsage():Promise<EnergyUsage>{        
    const payload = '{'+
        '"method": "get_energy_usage",'+
        '"requestTimeMils": ' + Math.round(Date.now() * 1000) + ''+
        '};';
     
    if(this.is_klap){
      return this.handleKlapRequest(payload).then((response)=>{
        if(response && response.result){
          this._consumption = {
            current: Math.ceil(response.result.current_power / 1000),
            total: response.result.today_energy / 1000,
          };
        } else{
          this._consumption = {
            current: 0,
            total: 0,
          };
        }
           
        return response.result;
      });
    }else{
      return this.handleRequest(payload).then((response)=>{
        if(response && response.result){
          this._consumption = {
            current: Math.ceil(response.result.current_power / 1000),
            total: response.result.today_energy / 1000,
          };
        } else{
          this._consumption = {
            current: 0,
            total: 0,
          };
        }
           
        return response.result;
      });
    }
    
  }

  public getPowerConsumption():ConsumptionInfo{
    return this._consumption;
  }
}