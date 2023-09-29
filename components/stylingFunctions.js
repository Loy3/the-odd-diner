export function nextPopular(type) {
    var itemIndex = 0;
    // console.log(storePopularItems);
    for (let p = 0; p < storePopularItems.length; p++) {
      if (storePopularItems[p].itemName === type) {
        itemIndex = p;
        console.log("first",itemIndex);
        itemIndex++;
      }
    }
    console.log(itemIndex);
    const arrLength = storePopularItems.length - 1;
    console.log(arrLength);
    if (itemIndex <= arrLength) {
      setPopularItems({
        id: storePopularItems[itemIndex].id,
        itemImageUrl: storePopularItems[itemIndex].itemImageUrl,
        itemName: storePopularItems[itemIndex].itemName,
        itemSub: storePopularItems[itemIndex].itemSub,
        itemPrepTime: storePopularItems[itemIndex].itemPrepTime,
        itemPrice: storePopularItems[itemIndex].itemPrice,
      });
    } else {
      setPopularItems({
        id: storePopularItems[0].id,
        itemImageUrl: storePopularItems[0].itemImageUrl,
        itemName: storePopularItems[0].itemName,
        itemSub: storePopularItems[0].itemSub,
        itemPrepTime: storePopularItems[0].itemPrepTime,
        itemPrice: storePopularItems[0].itemPrice,
      });
    }

  }