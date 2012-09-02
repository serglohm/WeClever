import QtQuick 1.1
import com.nokia.symbian 1.1

import "code.js" as Code
import "engine.js" as Engine


Page {
    id: mainPage
    Text {
        id: helloText
        anchors.top: parent.top
        text: qsTr("Hello world!")
        color: platformStyle.colorNormalLight
        font.pixelSize: 20
    }

    function getCategoriesCallback(data){
        console.log(data);
        for(var i = 0; i < data.length; i++){
            console.log(Code.obj2json(data[i]));
            listModel.append(data[i]);
        }
    }

    function getActionsCallback(data){
        console.log(data);
        for(var i = 0; i < data.length; i++){
            console.log("-----------------------------------------\n\n");
            console.log(Code.obj2json(data[i]));
            console.log("\n\n-----------------------------------------");
            actListModel.append(data[i]);
        }
    }


    Button{
        id: catButton
        anchors.top: helloText.bottom
        text: "get categories"
        onClicked: {
            var url = Engine.getUrlStart() + "/iphone_app/AppDataCategories/" + 0 + "/";
            console.log(url);
            listModel.clear();
            listView.delegate = catDelegate;

            listView.visible = true;
            actListView.visible = false;

            Code.getJSON(url, getCategoriesCallback);

        }
    }

    Component{
        id: catDelegate
        Rectangle{
                  height: labelText.height + 20
                  width: parent.width
                  radius: 5
                  Text{
                      id: labelText
                      anchors.right: parent.right
                      anchors.left: parent.left
                      anchors.top: parent.top
                      anchors.margins: 10
                      color: '#000'

                      text: cat_id + ": " + cat_name + "(" + has_child + ")"
                  }
                  MouseArea{
                      anchors.fill: parent
                      onClicked: {


                          if(parseInt(has_child) == 1){
                            listModel.clear();
                            listView.visible = true;
                            actListView.visible = false;
                            var url = Engine.getUrlStart() + "/iphone_app/AppDataCategories/" + cat_id + "/";
                            console.log(has_child + ' ' + url);
                            Code.getJSON(url, getCategoriesCallback);

                          } else {
                              listView.visible = false;
                              actListView.visible = true;
                              actListModel.clear();

                              var url = Engine.getUrlStart() + "/iphone_app/AppDataActionsPages/" + cat_id + "/10/0/1"

                              console.log("url: " + url);
                              Code.getJSON(url, getActionsCallback);
                          }
                }
            }
        }
    }

    Component{
        id: actDelegate
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

                }
            }
        }

    }

    ListModel{
        id: listModel
    }

    ListModel{
        id: actListModel
    }

    ListView{
        id: listView
        anchors.top: catButton.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        model: listModel
        spacing: 5
    }
    ListView{
        id: actListView
        visible: false
        anchors.top: catButton.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        model: actListModel
        delegate: actDelegate
        spacing: 5
    }
}
