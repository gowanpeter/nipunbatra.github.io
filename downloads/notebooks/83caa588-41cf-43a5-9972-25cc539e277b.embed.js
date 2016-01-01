console.log("embed.js");
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
(function(global) {
    if(typeof(window.bokeh_embed_count) == "undefined"){
        window.bokeh_embed_count = 0;
    }
    else {
        window.bokeh_embed_count += 1;
    }
    if(window.bokeh_embed_count == 1) {
//        debugger;
    }
    var host = "";

    var staticRootUrl = "http://localhost:5006/bokeh/static/";
    if (host!=""){

        staticRootUrl = "//" + host + "/bokehjs/static/";
        var bokehJSUrl = staticRootUrl + "js/bokeh.js";
    }
    else {
        bokehJSUrl = staticRootUrl +"js/bokeh.js";
    }

    var all_models = [{"attributes": {"column_names": ["x", "y"], "doc": null, "selected": [], "discrete_ranges": {}, "cont_ranges": {}, "data": {"y": [0.0, 0.6142127126896678, 0.9694002659393304, 0.9157733266550575, 0.4759473930370737, -0.16459459028073378, -0.7357239106731313, -0.9965844930066698, -0.8371664782625288, -0.32469946920468373, 0.3246994692046833, 0.8371664782625285, 0.99658449300667, 0.7357239106731323, 0.1645945902807347, -0.4759473930370729, -0.9157733266550572, -0.9694002659393306, -0.6142127126896683, -4.898587196589413e-16], "x": [0.0, 0.6613879270715354, 1.3227758541430708, 1.984163781214606, 2.6455517082861415, 3.306939635357677, 3.968327562429212, 4.6297154895007475, 5.291103416572283, 5.9524913436438185, 6.613879270715354, 7.2752671977868895, 7.936655124858424, 8.59804305192996, 9.259430979001495, 9.92081890607303, 10.582206833144566, 11.243594760216101, 11.904982687287637, 12.566370614359172]}, "id": "bed80e69-1704-49b8-b8b7-ca1b0f6dcde4"}, "type": "ColumnDataSource", "id": "bed80e69-1704-49b8-b8b7-ca1b0f6dcde4"}, {"attributes": {"column_names": ["x", "y"], "doc": null, "selected": [], "discrete_ranges": {}, "cont_ranges": {}, "data": {"y": [0.0, 0.6142127126896678, 0.9694002659393304, 0.9157733266550575, 0.4759473930370737, -0.16459459028073378, -0.7357239106731313, -0.9965844930066698, -0.8371664782625288, -0.32469946920468373, 0.3246994692046833, 0.8371664782625285, 0.99658449300667, 0.7357239106731323, 0.1645945902807347, -0.4759473930370729, -0.9157733266550572, -0.9694002659393306, -0.6142127126896683, -4.898587196589413e-16], "x": [0.0, 0.6613879270715354, 1.3227758541430708, 1.984163781214606, 2.6455517082861415, 3.306939635357677, 3.968327562429212, 4.6297154895007475, 5.291103416572283, 5.9524913436438185, 6.613879270715354, 7.2752671977868895, 7.936655124858424, 8.59804305192996, 9.259430979001495, 9.92081890607303, 10.582206833144566, 11.243594760216101, 11.904982687287637, 12.566370614359172]}, "id": "92498786-46f1-4f21-8f51-e873a96beeb3"}, "type": "ColumnDataSource", "id": "92498786-46f1-4f21-8f51-e873a96beeb3"}, {"attributes": {"sources": [{"source": {"type": "ColumnDataSource", "id": "bed80e69-1704-49b8-b8b7-ca1b0f6dcde4"}, "columns": ["x"]}, {"source": {"type": "ColumnDataSource", "id": "92498786-46f1-4f21-8f51-e873a96beeb3"}, "columns": ["x"]}], "id": "2786a15d-9776-4974-8586-e370cf79da12", "doc": null}, "type": "DataRange1d", "id": "2786a15d-9776-4974-8586-e370cf79da12"}, {"attributes": {"sources": [{"source": {"type": "ColumnDataSource", "id": "bed80e69-1704-49b8-b8b7-ca1b0f6dcde4"}, "columns": ["y"]}, {"source": {"type": "ColumnDataSource", "id": "92498786-46f1-4f21-8f51-e873a96beeb3"}, "columns": ["y"]}], "id": "ed4e7b96-86a2-4506-ab78-4b474c889bd8", "doc": null}, "type": "DataRange1d", "id": "ed4e7b96-86a2-4506-ab78-4b474c889bd8"}, {"attributes": {"doc": null, "id": "77529df9-9c51-4400-94d8-68cc885c8d52"}, "type": "BasicTickFormatter", "id": "77529df9-9c51-4400-94d8-68cc885c8d52"}, {"attributes": {"doc": null, "id": "12db2100-b72c-416d-901c-895d19a69407"}, "type": "BasicTicker", "id": "12db2100-b72c-416d-901c-895d19a69407"}, {"attributes": {"plot": {"type": "Plot", "id": "83caa588-41cf-43a5-9972-25cc539e277b"}, "doc": null, "bounds": "auto", "id": "30aab610-daa9-40ad-8b96-be1629b45194", "location": "min", "formatter": {"type": "BasicTickFormatter", "id": "77529df9-9c51-4400-94d8-68cc885c8d52"}, "ticker": {"type": "BasicTicker", "id": "12db2100-b72c-416d-901c-895d19a69407"}, "dimension": 0}, "type": "LinearAxis", "id": "30aab610-daa9-40ad-8b96-be1629b45194"}, {"attributes": {"plot": {"type": "Plot", "id": "83caa588-41cf-43a5-9972-25cc539e277b"}, "doc": null, "axis": {"type": "LinearAxis", "id": "30aab610-daa9-40ad-8b96-be1629b45194"}, "id": "c2b68e3e-5a8d-431a-9cd3-e4e576a7f5ce", "dimension": 0}, "type": "Grid", "id": "c2b68e3e-5a8d-431a-9cd3-e4e576a7f5ce"}, {"attributes": {"doc": null, "id": "05523a14-81fc-4cbb-81e8-517130b26ea5"}, "type": "BasicTickFormatter", "id": "05523a14-81fc-4cbb-81e8-517130b26ea5"}, {"attributes": {"doc": null, "id": "f5959289-cca8-4eeb-933c-051bb4939fd1"}, "type": "BasicTicker", "id": "f5959289-cca8-4eeb-933c-051bb4939fd1"}, {"attributes": {"plot": {"type": "Plot", "id": "83caa588-41cf-43a5-9972-25cc539e277b"}, "doc": null, "bounds": "auto", "id": "40f89acb-9da1-4427-b5b9-4ad9c0cac34f", "location": "min", "formatter": {"type": "BasicTickFormatter", "id": "05523a14-81fc-4cbb-81e8-517130b26ea5"}, "ticker": {"type": "BasicTicker", "id": "f5959289-cca8-4eeb-933c-051bb4939fd1"}, "dimension": 1}, "type": "LinearAxis", "id": "40f89acb-9da1-4427-b5b9-4ad9c0cac34f"}, {"attributes": {"plot": {"type": "Plot", "id": "83caa588-41cf-43a5-9972-25cc539e277b"}, "doc": null, "axis": {"type": "LinearAxis", "id": "40f89acb-9da1-4427-b5b9-4ad9c0cac34f"}, "id": "da4a755c-3ca0-4de5-8991-044fac9ac628", "dimension": 1}, "type": "Grid", "id": "da4a755c-3ca0-4de5-8991-044fac9ac628"}, {"attributes": {"data_source": {"type": "ColumnDataSource", "id": "bed80e69-1704-49b8-b8b7-ca1b0f6dcde4"}, "server_data_source": null, "doc": null, "nonselection_glyphspec": {"line_color": {"value": "#1f77b4"}, "line_width": {"units": "data", "field": "line_width"}, "angle_units": "deg", "type": "line", "y": {"units": "data", "field": "y"}, "x": {"units": "data", "field": "x"}, "line_alpha": {"units": "data", "value": 0.1}, "start_angle_units": "deg", "valign": null, "radius_units": "screen", "visible": null, "end_angle_units": "deg", "line_dash_offset": 0, "line_cap": "butt", "line_dash": [], "length_units": "screen", "margin": null, "line_join": "miter", "halign": null}, "xdata_range": null, "ydata_range": null, "glyphspec": {"line_color": {"value": "#0000FF"}, "line_alpha": {"units": "data", "value": 1.0}, "line_width": {"units": "data", "field": "line_width"}, "y": {"units": "data", "field": "y"}, "x": {"units": "data", "field": "x"}, "type": "line"}, "id": "94293a01-7122-4d72-87aa-175566c5824b"}, "type": "Glyph", "id": "94293a01-7122-4d72-87aa-175566c5824b"}, {"attributes": {"data_source": {"type": "ColumnDataSource", "id": "92498786-46f1-4f21-8f51-e873a96beeb3"}, "server_data_source": null, "doc": null, "nonselection_glyphspec": {"line_color": {"value": "#1f77b4"}, "line_width": {"units": "data", "field": "line_width"}, "angle_units": "deg", "type": "line", "y": {"units": "data", "field": "y"}, "x": {"units": "data", "field": "x"}, "line_alpha": {"units": "data", "value": 0.1}, "start_angle_units": "deg", "valign": null, "radius_units": "screen", "visible": null, "end_angle_units": "deg", "line_dash_offset": 0, "line_cap": "butt", "line_dash": [], "length_units": "screen", "margin": null, "line_join": "miter", "halign": null}, "xdata_range": null, "ydata_range": null, "glyphspec": {"line_color": {"value": "#0000FF"}, "line_alpha": {"units": "data", "value": 1.0}, "line_width": {"units": "data", "field": "line_width"}, "y": {"units": "data", "field": "y"}, "x": {"units": "data", "field": "x"}, "type": "line"}, "id": "683f278d-cfe2-4b91-9dd8-bfe74a782afc"}, "type": "Glyph", "id": "683f278d-cfe2-4b91-9dd8-bfe74a782afc"}, {"attributes": {"plot": {"type": "Plot", "id": "83caa588-41cf-43a5-9972-25cc539e277b"}, "dimensions": ["width", "height"], "doc": null, "id": "2d7c33c6-d6d7-4b3a-a07c-96b8f9039b1f"}, "type": "PanTool", "id": "2d7c33c6-d6d7-4b3a-a07c-96b8f9039b1f"}, {"attributes": {"outer_height": 600, "x_range": {"type": "DataRange1d", "id": "2786a15d-9776-4974-8586-e370cf79da12"}, "y_range": {"type": "DataRange1d", "id": "ed4e7b96-86a2-4506-ab78-4b474c889bd8"}, "outer_width": 600, "renderers": [{"type": "LinearAxis", "id": "30aab610-daa9-40ad-8b96-be1629b45194"}, {"type": "Grid", "id": "c2b68e3e-5a8d-431a-9cd3-e4e576a7f5ce"}, {"type": "LinearAxis", "id": "40f89acb-9da1-4427-b5b9-4ad9c0cac34f"}, {"type": "Grid", "id": "da4a755c-3ca0-4de5-8991-044fac9ac628"}, {"type": "Glyph", "id": "94293a01-7122-4d72-87aa-175566c5824b"}, {"type": "Glyph", "id": "683f278d-cfe2-4b91-9dd8-bfe74a782afc"}], "id": "83caa588-41cf-43a5-9972-25cc539e277b", "data_sources": [], "doc": null, "canvas_height": 600, "title": "Plot", "tools": [{"type": "PanTool", "id": "2d7c33c6-d6d7-4b3a-a07c-96b8f9039b1f"}], "canvas_width": 600}, "type": "Plot", "id": "83caa588-41cf-43a5-9972-25cc539e277b"}, {"attributes": {"doc": null, "children": [{"type": "Plot", "id": "83caa588-41cf-43a5-9972-25cc539e277b"}], "id": "c9d8389e-9885-4688-af76-5c2c673f9c3e"}, "type": "PlotContext", "id": "c9d8389e-9885-4688-af76-5c2c673f9c3e"}];
    var modeltype = "PlotContext";
    var elementid = "84eca9ff-6e40-4757-a2ff-daa9f768ad35";
    var plotID = "83caa588-41cf-43a5-9972-25cc539e277b";
    var dd = {};
    dd[plotID] = all_models;
    

    var secondPlot =                 function() {
        console.log("Bokeh.js loaded callback");
        embed_core = Bokeh.embed_core;
        console.log("embed_core loaded");
        embed_core.injectCss(staticRootUrl);
        Bokeh.HasProperties.prototype.sync = Backbone.sync
        embed_core.search_and_plot(dd);
        console.log("search_and_plot called", new Date());}

    function addEvent(el, eventName, func){
        if(el.attachEvent){
            return el.attachEvent('on' + eventName, func);}
        else {
            el.addEventListener(eventName, func, false);}}
    var script_injected = !(typeof(_embed_bokeh_inject_application) == "undefined") && _embed_bokeh_inject_application;
    //var script_injected = !(typeof(_embed_bokeh_inject_application) == "undefined");
    if(typeof Bokeh == "object"){
        // application.js is already loaded
        console.log("bokeh.js is already loaded, going straight to plotting");
        setTimeout(function () {
            embed_core = Bokeh.embed_core;
            console.log("calling embed_core.search_and_plot, from already loaded bokehjs state")
            embed_core.search_and_plot(dd);}, 20);}

    else if(!script_injected){
        // bokeh.js isn't loaded and it hasn't been scheduled to be injected
        var s = document.createElement('script');
        s.async = true; s.src = bokehJSUrl; s.id="bokeh_script_tag";
        
    }
    else {
        var s = document.getElementById("bokeh_script_tag");
    }
    var local_bokeh_embed_count = window.bokeh_embed_count;
    if(typeof(s) != "undefined") {
    addEvent(
        s,'load',
        function() {
            setTimeout(secondPlot, 20 * local_bokeh_embed_count);});
    }
    if(!script_injected){
        document.body.appendChild(s);
    }

    _embed_bokeh_inject_application = true;

    window._embed_bokeh = true;}(this));