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


    function getCategoriesCallback(data){
        indicator.visible = false;
        indicator.running = false;
        for(var i = 0; i < data.length; i++){
            listModel.append(data[i]);
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
