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
            height: 170 * 162 / 300 + labelText.height + 20
            width: parent.width
            color: "#8BB44E"
            Text{
                id: labelText
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                width: parent.width
                color: '#fff'
                wrapMode: Text.WordWrap
                anchors.margins: 10
                horizontalAlignment: Text.AlignHCenter
                text: act_name
            }

            Rectangle{
                color: "#63A304"
                width: parent.width - 170
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                height: 170 * 162 / 300
                Text{
                    id: cntText
                    anchors.centerIn: parent
                    color: '#fff'
                    font.pixelSize: 40
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                    text: packet.get(0).discountprice + ' руб.'
                }
            }
            Image {
                id: catImage
                anchors.bottom: parent.bottom
                anchors.left: parent.left
                width: 170
                height: 170 * 162 / 300
                fillMode: Image.PreserveAspectFit
                source: act_image
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
            console.log(Code.obj2json(data[i]));
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
