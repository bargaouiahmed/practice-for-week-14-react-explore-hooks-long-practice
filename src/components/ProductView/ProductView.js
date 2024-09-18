import React, { useState, useEffect } from 'react';
import ProductListItem from "../ProductListItem";
import ProductDetails from "../ProductDetails";
import './ProductView.css';

function ProductView({ products }) {
  // Initialize sideOpen from localStorage, defaulting to true if not set
  const [sideOpen, setSideOpen] = useState(() => {
    const storedValue = localStorage.getItem('sideOpen');
    return storedValue === 'true';  // Default to true (open) if no stored value
  });

  // Initialize selected from localStorage, defaulting to null if not set
  const [selected, setSelected] = useState(() => {
    const storedValue = localStorage.getItem('selected');
    return storedValue ? storedValue : null;  // Default to null if no selected item
  });

  // Initialize productDetails based on the selected product from localStorage
  const [productDetails, setProductDetails] = useState(() => {
    if (selected) {
      const product = products.find(p => p.id === selected);
      return product ? product : null;
    }
    return null;
  });

  // Update productDetails when selected product changes
  useEffect(() => {
    if (selected) {
      const product = products.find(p => p.id === selected);
      setProductDetails(product ? product : null);
    }
  }, [selected, products]);

  // Persist sideOpen to localStorage when it changes
  useEffect(() => {
    console.log(`sideOpen CHANGED TO:`, sideOpen);  // Debugging log
    localStorage.setItem('sideOpen', sideOpen.toString());
  }, [sideOpen]);

  // Persist selected to localStorage when it changes
  useEffect(() => {
    console.log(`selected CHANGED TO:`, selected);  // Debugging log
    localStorage.setItem('selected', selected || '');  // Store empty string if no selected product
  }, [selected]);

  // Ensure side panel opens if a product is selected
  useEffect(() => {
    if (selected) {
      setSideOpen(true);
    }
  }, [selected]);

  // Close the side panel if it's toggled closed, and clear the selected product
  useEffect(() => {
    if (!sideOpen) {
      setSelected(null);
      setProductDetails(null);  // Clear product details when side panel is closed
    }
  }, [sideOpen]);

  // Track re-renders for debugging purposes
  console.log("ProductView Re-rendered");

  return (
    <div className="product-view">
      <div className="product-main-area">
        <h1>Products</h1>
        <div className="product-list">
          {products.map(item =>
            <ProductListItem
              key={item.id}
              product={item}
              isSelected={selected === item.id}
              onClick={() => {
                setProductDetails(item);  // Set the clicked product details
                setSelected(item.id);     // Set the selected product id
              }}
            />
          )}
        </div>
      </div>
      <div className="product-side-panel">
        <div className="product-side-panel-toggle-wrapper">
          <div className="product-side-panel-toggle"
               onClick={() => setSideOpen(!sideOpen)}>
            {sideOpen ? '>' : '<'}
          </div>
        </div>
        <ProductDetails visible={sideOpen} product={productDetails} />
      </div>
    </div>
  );
}

export default ProductView;
