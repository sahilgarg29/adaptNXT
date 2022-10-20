const axios = require("axios");
const { JSDOM } = require("jsdom");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

function getDataFromOfficeDepot(data) {
  const dom = new JSDOM(data).window;
  const res = [];
  let category = dom.document
    .querySelector("ol")
    .lastElementChild.textContent.trim();

  console.log(category);

  dom.document.querySelectorAll(".gw3.omega.sku_item").forEach((ele) => {
    const dom1 = new JSDOM(ele.innerHTML).window.document;
    let id = dom1.querySelector(".sku_id").firstElementChild.textContent;
    id = id.trim().split(" ");
    id = id[id.length - 1];

    let productName = dom1
      .querySelector(".sku_description")
      .firstElementChild.textContent.trim();

    let price = dom1
      .querySelector(".unified_price_row.unified_sale_price.red_price")
      .firstElementChild.textContent.trim();
    console.log(
      "id - ",
      id,
      " product Name - ",
      productName,
      " price - ",
      price
    );

    res.push({
      productName: productName,
      productPrice: price,
      sku: id,
      productCategory: category,
    });
  });

  return res;
}

axios
  .get(
    "https://www.officedepot.com/a/browse/ergonomic-office-chairs/N=5+593065&amp;cbxRefine=1429832/"
  )
  .then((res) => {
    let result = getDataFromOfficeDepot(res.data);
    const csvWriter = createCsvWriter({
      path: "out.csv",
      header: [
        { id: "productName", title: "Product Name" },
        { id: "productPrice", title: "Product Price" },
        { id: "sku", title: "SKU" },
        { id: "productCategory", title: "Product Category" },
      ],
    });

    csvWriter.writeRecords(result).then(() => console.log("successfull"));
  });
