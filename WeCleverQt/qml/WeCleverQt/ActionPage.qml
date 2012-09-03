import QtQuick 1.1
import com.nokia.symbian 1.1

import "code.js" as Code
import "engine.js" as Engine


Page {
    id: actionPage
    property int actionId: 0

    Rectangle{
        anchors.fill: parent
        color: '#F2797F'
        Flickable{
            anchors.fill: parent
            contentHeight: productItem.height + 20
            flickableDirection: Flickable.VerticalFlick
            Rectangle {
                id: productItem
                color: "#fff"
                radius: 10
                anchors.top: parent.top
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.margins: 10
                height: cnameText.height +
                        itemImage.height +
                        annotationText.height +
                        priceText.height +
                        basketButton.height +
                        descriptionText.height +
                        6*20

                Text{
                    id: cnameText
                    text: ''
                    anchors.top: parent.top
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.margins: 10
                    wrapMode: Text.WordWrap
                    color: '#FF1170'
                    font.bold: true
                    font.pixelSize: 30
                }
                Image{
                    id: itemImage
                    fillMode: Image.PreserveAspectFit
                    anchors.top: cnameText.bottom
                    anchors.horizontalCenter: parent.horizontalCenter
                    anchors.margins: 10
                    smooth: true
                    height: 200

                }
                Text{
                    id: annotationText
                    text: ""
                    anchors.top: itemImage.bottom
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.margins: 10
                    wrapMode: Text.WordWrap
                    color: '#333'
                }
                Text{
                    id: priceText
                    text: ""
                    anchors.top: annotationText.bottom
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.margins: 10
                    wrapMode: Text.WordWrap
                    font.pixelSize: 30
                    color: '#FF1170'
                }
                Button{
                    id: basketButton
                    text: "В корзину"
                    anchors.top: priceText.bottom
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.margins: 10
                    //color: '#FF1170'
                    onClicked: {


                    }
                }
                Text{
                    id: descriptionText
                    text: description
                    anchors.top: basketButton.bottom
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.margins: 10
                    wrapMode: Text.WordWrap
                    color: '#333'
                }


            }
        }
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

    function getActionCallback(data){
        console.log('----------- getActionCallback -----------');
        console.log(data[0].name);
        //console.log(Code.obj2json(data));

        indicator.visible = false;
        indicator.running = false;

        cnameText.text = data[0].act_name;

        var desc = data[0].conditions;
        console.log('-------------------');
        console.log(desc);
        console.log('-------------------');

        console.log('indexOf ' + desc.indexOf('</li>'));

        desc = desc.split('\\n').join('\n');
        desc = desc.split('</li>').join('</li>');
        desc = desc.split('<li>').join('<li>');
        desc = desc.split('<ul>').join('<ul>');
        desc = desc.split('</ul>').join('</ul>');

        descriptionText.text = desc;

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
