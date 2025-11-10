class Inventory {
  constructor() {
    this.magazijnestatus = false;
    this.inventorystatus = false;
    this.griparmstatus = false;
    this.IRsensorstatus = false;
    this.IR2_sensorstatus = false;
    this.grijp_arm_x_positie = 0;
    this.grijp_arm_y_positie = 0;
    this.hasdroppedstatus = false;
    this.haspickedstatus = false;
  }

    MagMagazijnBeginnen()
    {

        if(magazijnestatus== true & inventorystatus== true & griparmstatus== true)
        {
            return true;
        }
        else{
            return false;
        }
    }

    StartMagazijn()
    {
        if(this.MagMagazijnBeginnen())
        {
            "Move ARM to magazijn start positie"
            return true;
        }

        else{
            return false;
        }
    }

    ZetArmOpDePositie(){
        if(this.grijp_arm_x_positie != 0 & this.grijp_arm_y_positie != 0)
        {
            "Move ARM to X: " + this.grijp_arm_x_positie + " Y: " + this.grijp_arm_y_positie
            return true;
        }
        else{
            return false;
        }
    }

     BrengenNaarBestemming(){

        if(this.grijp_arm_x_positie != 1 & this.grijp_arm_y_positie != 1 & this.haspickedstatus == true)
        {
            "Move ARM to X: " + this.grijp_arm_x_positie + " Y: " + this.grijp_arm_y_positie
            return true;
        }
        else{
            return false;
        }
    }

    PakkenvanBlok(){
        if(this.IRsensorstatus == true & this.haspickedstatus == false)
        {
            "the arm picks the block"
            this.haspickedstatus = true;
            return true;
        }   
        else{
            return false;
        }
    }

   
    LosseVanBlok(){
        if(this.IR2_sensorstatus == true & this.IR1_sensorstatus != true & this.hasdroppedstatus == false)
        {
            "the arm drops the block"
            this.hasdroppedstatus = true;
            return true;
        }   
        else{
            return false;
        }
}

checkenofblockisgedropt(){
    if(this.hasdroppedstatus == true)
    {
        return true;
    }           
    else{
        return false;

    }
}


stopMagazijn()
{
    if(this.checkenofblockisgedropt() == true)
    {
        "Move ARM to magazijn stop positie"
        return true;
    }
    else{
        return false;
    }
}

}

