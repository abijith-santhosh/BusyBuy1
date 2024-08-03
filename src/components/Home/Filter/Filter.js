import styles from "./filter.module.css";

// Render Filter
export default function Filter(props) {
  const { price, setPrice, setCategory } = props;

  const handlePriceChange = (e) => {
    setPrice(Number(e.target.value)); // Ensure the price is a number
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <div className={styles.filterBar}>
      <h1>Filter</h1>
      <div className={styles.priceRange}>
        <span>Price</span>
        {`<=${price}`}
        <br />
        <input
          type="range"
          min="100"
          max="60000"
          value={price}
          onChange={handlePriceChange}
        />
      </div>
      <div className={styles.categoryBox}>
        {/* Sub heading */}
        <span>Category:</span>

        {/* Radio buttons for different categories */}
        <div>
          {/* Men category */}
          <input
            type="radio"
            id="men"
            value="men's clothing"
            name="category"
            onChange={handleCategoryChange}
          />
          <label htmlFor="men">Men</label>

          {/* Women category */}
          <input
            type="radio"
            id="women"
            value="women's clothing"
            name="category"
            onChange={handleCategoryChange}
          />
          <label htmlFor="women">Women</label>

          {/* Electronics */}
          <input
            type="radio"
            id="electronics"
            value="electronics"
            name="category"
            onChange={handleCategoryChange}
          />
          <label htmlFor="electronics">Electronics</label>

          {/* Jewellery */}
          <input
            type="radio"
            id="jewellery"
            value="jewelery"
            name="category"
            onChange={handleCategoryChange}
          />
          <label htmlFor="jewellery">Jewellery</label>
        </div>
      </div>
    </div>
  );
}
