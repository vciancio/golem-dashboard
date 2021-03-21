export default class GolemNode {
    constructor(data) {
        if(data['golem']){
            this.info = data['golem'];
        } else {
            this.info = data['info'];
        }
        this.hardware = data['hardware'];
    }
}