sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("recruitervalidator.controller.Main", {
            onInit: function () {
                var oModel = new JSONModel(sap.ui.require.toUrl("recruitervalidator/data/data.json"));
                this.getView().setModel(oModel);
                var viewModel = new JSONModel({
                    fileName: "",
                    selectedRoleGroup: null,
                    isFinish: false
                });
                this.getView().setModel(viewModel, "viewModel");
                this.getView().setModel(new JSONModel([]), "fileContent");
                this.navContainer = this.getView().byId("navCon");
            },
            onChangeRoleGroup: function (oEvt) {
                var selectedKey = oEvt.getSource().getSelectedKey();

                this.navContainer.getBinding("pages").filter([new sap.ui.model.Filter("group", "EQ", selectedKey)]);
                this.reset();

            },
            onNext: function (oEvt) {
                debugger;


                var currentIndexPage = this.navContainer.indexOfPage(this.navContainer.getCurrentPage());
                var aPages = this.navContainer.getPages();
                var lastPageIndex = aPages.length - 1;
                var nextPageIndex = currentIndexPage + 1;

                if (nextPageIndex <= lastPageIndex) {
                     this.navContainer.to(aPages[currentIndexPage + 1]); 
                }
                else{
                     this.getView().getModel("viewModel").setProperty("/isFinish",true);
                }


            },
            onPrev: function (oEvt) {
                	this.navContainer.back();


            },
             reset: function () {
                 this.getView().getModel("viewModel").setProperty("/isFinish",false);
                
             },
            uploadData: function (oEvt) {
                this.reset();
                var oSource = oEvt.getSource();
                this.filepath = oSource.oFileUpload.value;
                var file = oEvt.getParameter("files")[0];
                this.filedata = file;
                this.getView().getModel("viewModel").setProperty("/fileName", oEvt.getParameter("newValue"));
                var reader = new FileReader();
                var that = this;
                reader.onload = function (oEvt2) {
                    var oData = oEvt2.target.result;
                    var sData = null;
                    var Data = that.getView().getModel("fileContent").getData();


                    sData = oData.split("\n");


                    Data = sData.map(function (item) {
                        const sItem = item.split(";");
                        return {
                            group: sItem[0],
                            text: sItem[1]
                        }
                    });
                    that.getView().getModel("fileContent").setData(Data);
                }.bind(this);
                reader.readAsText(file);

            },

        });
    });
