import QtQuick 1.1
import com.nokia.symbian 1.1

import "code.js" as Code
import "engine.js" as Engine


Page {
    id: actionPage
    property int actionId: 0

    BusyIndicator {
        id: indicator
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.verticalCenter: parent.verticalCenter
        running: false
        width: parent.width / 3
        height: parent.width / 3
        visible: false
        z: 2
    }

    function getActionCallback(data){
        console.log('----------- getActionCallback -----------');
        console.log(data[0].name);
        console.log(Code.obj2json(data));

        indicator.visible = false;
        indicator.running = false;

    }

    onStatusChanged: {
        if(status == 2){
            var url = Engine.getUrlStart() + "/iphone_app/AppDataActions/" + actionId + "/"
            console.log(url);
            Code.getJSON(url, getActionCallback);
            indicator.visible = true;
            indicator.running = true;

        }
    }



}
