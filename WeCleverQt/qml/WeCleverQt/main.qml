import QtQuick 1.1
import com.nokia.symbian 1.1

PageStackWindow {
    id: window
    showStatusBar: true
    showToolBar: true

    Component.onCompleted: {
        getCategories();
    }

    function getSubCategories(cid){
        pageStack.push(Qt.resolvedUrl("CategoryPage.qml"), {tools: toolBarLayout, categoryId: cid});
    }

    function getCategories(){
        pageStack.push(Qt.resolvedUrl("CategoryPage.qml"), {tools: toolBarLayout, categoryId: 0});
    }

    function getActions(cid){
        pageStack.push(Qt.resolvedUrl("ActionsPage.qml"), {tools: toolBarLayout, categoryId: cid});
    }

    function getAction(aid){
        pageStack.push(Qt.resolvedUrl("ActionPage.qml"), {tools: toolBarLayout, actionId: aid});
    }

    ToolBarLayout {
        id: toolBarLayout
        ToolButton {
            flat: true
            iconSource: "toolbar-back"
            onClicked: window.pageStack.depth <= 1 ? Qt.quit() : window.pageStack.pop()
        }
        ToolButton {
            flat: true
            iconSource: "toolbar-home"//"toolbar-content-ovi-music"
            onClicked: {
                window.pageStack.push(Qt.resolvedUrl("CartPage.qml"));
            }
        }
    }

}
