import QtQuick 1.1
import com.nokia.symbian 1.1

import "code.js" as Code
import "engine.js" as Engine


Page {
    id: subCategoryPage
    property int categoryId: 0

    Component{
        id: delegate
        Rectangle{
            height: 170 * 162 / 300
            width: parent.width
            color: "#8BB44E"
            Text{
                id: labelText
                anchors.right: parent.right
                anchors.top: parent.top
                width: parent.width - 170
                color: '#fff'
                horizontalAlignment: Text.AlignHCenter
                text: cat_name
            }

            Text{
                id: cntText
                anchors.right: parent.right
                anchors.top: labelText.bottom
                anchors.bottom: parent.bottom
                width: parent.width - 170
                color: '#fff'
                font.pixelSize: 50
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                text: number// + " " + (number % 10 > 4 || (number > 9 && number < 21) ? "акций": (number % 10 == 1 ? "акция": "акции")) + ")"
            }

            Image {
                id: catImage
                anchors.top: parent.top
                anchors.left: parent.left
                width: 170
                height: 170 * 162 / 300
                fillMode: Image.PreserveAspectFit
                source: cat_image
            }
            MouseArea{
                anchors.fill: parent
                onClicked: {
                    if(parseInt(has_child) == 1){
                        getSubCategories(cat_id);
                    } else {
                        getActions(cat_id);
                    }
                }
            }
        }
    }



    ListModel{
        id: listModel
    }

    ListView{
        id: listView
        delegate: delegate
        anchors.fill: parent
        model: listModel
        spacing: 1
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


    function getCategoriesCallback(data){
        indicator.visible = false;
        indicator.running = false;
        for(var i = 0; i < data.length; i++){
            listModel.append(data[i]);

            console.log(Code.obj2json(data[i]));
        }
    }

    onStatusChanged: {
        if(status == 2){
            var url = Engine.getUrlStart() + "/iphone_app/AppDataCategories/" + subCategoryPage.categoryId + "/";
            listModel.clear();
            console.log(url);
            Code.getJSON(url, getCategoriesCallback);
            indicator.visible = true;
            indicator.running = true;

        }
    }


}
