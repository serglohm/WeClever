import QtQuick 1.1
import com.nokia.symbian 1.1

import "code.js" as Code
import "engine.js" as Engine


Page {
    id: actionsPage
    property int categoryId: 0

    ListModel{
        id: listModel
    }

    Component{
        id: delegate
        Rectangle{
            height: actImage.height + actLabelText.height + 30
            width: parent.width
            radius: 10
            Text{
              id: actLabelText
              anchors.right: parent.right
              anchors.left: parent.left
              anchors.top: parent.top
              anchors.margins: 10
              color: '#000'
              wrapMode: Text.WordWrap
              text: act_name
            }
            Image{
                id: actImage
                width: 300
                height: 162
                source: act_image
                anchors.horizontalCenter: parent.horizontalCenter
                y: actLabelText.height + 20

            }
            MouseArea{
                anchors.fill: parent
                onClicked: {
                    getAction(act_id);
                }
            }
        }

    }

    ListView{
        id: listView
        anchors.fill: parent
        model: listModel
        delegate: delegate
        spacing: 5
    }

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

    function getActionsCallback(data){
        indicator.visible = false;
        indicator.running = false;
        for(var i = 0; i < data.length; i++){
            console.log(data[i]);
            listModel.append(data[i]);
        }
    }

    onStatusChanged: {
        if(status == 2){
            var url = Engine.getUrlStart() + "/iphone_app/AppDataActionsPages/" + categoryId + "/10/0/1"
            listModel.clear();
            console.log(url);
            Code.getJSON(url, getActionsCallback);
            indicator.visible = true;
            indicator.running = true;

        }
    }
}
