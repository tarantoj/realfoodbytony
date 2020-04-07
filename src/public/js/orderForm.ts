import { ProduceDocument } from "../../models/Produce";

$(document).ready(function() {

    const getProduce = (fn: Function) => {
        $.get("/produce?json=true", fn);
    }

    getProduce((data: [ProduceDocument]) => {
        console.log(data);
        console.log(data[0].id);

    });
    // Place JavaScript code here...
    $('.line-item').change(() => {
        var element = this
        console.log($(this));
    })
});

