//const items = ["shirt", "pant", "laptop"]

const getAmazonProductSearch = async (items) => {
    const data = items.map((item)=>{
        return({item:item, num_results:10, max_price:100})
    })

    try {
      const response = await fetch('http://localhost:8000/process_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({items:data}),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const json = await response.json();

      const item1 = []
      const item2 = []
      const item3 = []
      const item4 = []
      const arr = {bundles:[], products:[]};
      const bundleArr = []
      for(let i=0; i<5;i++){
        for(let item in json[i]){
            item1.push(json[i][item][0])
            item2.push(json[i][item][1])
            item3.push(json[i][item][2])
            item4.push(json[i][item][3])
            
        }
      }
      bundleArr.push(item1, item2, item3, item4)
      arr.bundles=bundleArr
      for(let i=0; i<5;i++){
        for(let item in json[i]){
            arr.products.push({"name": item, "res" :json[i][item]})
        }
      }
      return arr
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  //getAmazonProductSearch(items)
  module.exports = { getAmazonProductSearch };
  