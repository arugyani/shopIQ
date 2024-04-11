import {
  ProductType,
  productsAsync,
  selectProductList,
  selectSelected,
  selectStatus,
  setSelected,
} from "@/app/features/productSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { FC, useEffect } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ProductObject } from "@/types-and-interfaces";
import { selectCurrentProducts, selectStatus } from "@/app/features/historySlice";

interface ProductProps {
  product: ProductObject;
}

const Product: FC<ProductProps> = ({ id, product }) => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSelected);

  const { title, imgLink, reviews, price } = product;
  const quality = reviews[0].split("(")[0].trim();

  const handleClick = () => {
    if (selected === null) {
      dispatch(setSelected(id));
    }
  };

  return (
    <>
      {selected === id && (
        <div className='absolute top-0 left-0 right-0 bottom-0 w-[95%] h-[95%] bg-blue-500'>
          <h1>Hello</h1>
        </div>
      )}
      <div
        className='border border-gray-300 shadow-lg rounded-lg px-4 py-8 w-full h-full flex flex-col items-center justify-center mx-auto my-8 hover:bg-neutral-100 transition-color cursor-pointer'
        onClick={handleClick}
      >
        <h1 className='text-xl font-bold mb-10 text-center'>{title}</h1>
        <div className='flex w-full flex-row justify-between items-center gap-4'>
          {imgLink !== null && (
            <img
              src={imgLink}
              className={`mb-4 w-2/5 border-4 border-gray-400 rounded p-2`}
            />
          )}
          <div className='flex-1 grow flex flex-col justify-center items-center'>
            <h1
              className={`hidden lg:inline bg-gray-800 text-white text-sm font-bold py-2 px-4 w-${
                imgLink != null ? "full" : "1/2"
              } rounded-full mb-2 truncate text-center`}
            >
              {quality}
            </h1>
            <h3 className='text-xl font-semibold'>{price}</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export const ProductList = () => {

  const status = useAppSelector(selectStatus);
  const productList = useAppSelector(selectCurrentProducts)

  return (
    <div className='relative mx-auto w-full h-fit grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center items-center'>
      {status === "loading" ? (
        <LoadingSpinner className='text-gray-500' width={45} height={45} />
      ) : (
        productList
          .slice(0, 4)
          .map((product, i) => <Product key={i} id={i} product={product} />)
      )}
    </div>
  );
};
