import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { FC, useEffect } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ProductObject } from "@/types-and-interfaces";
import {
  productsAsync,
  selectAllQuestionsAnswered,
  selectCurrentHistoryId,
  selectCurrentProducts,
  selectCurrentQuestions,
  selectProductStatus,
  updateCurrentProductId,
  selectCurrentProduct,
} from "@/app/features/historySlice";
import { ArrowLeftCircle } from "lucide-react";

interface ProductProps {
  product: ProductObject;
}

const Product: FC<ProductProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const { title, imgLink, reviews, price } = product;
  const quality = reviews[0].split("(")[0].trim();

  const handleClick = () => {
    dispatch(updateCurrentProductId({ productId: product.id }));
  };

  return (
    <>
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
  const productList = useAppSelector(selectCurrentProducts);
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectProductStatus);
  const productList = useAppSelector(selectCurrentProducts);
  const allQuestionsAnswered = useAppSelector(selectAllQuestionsAnswered);
  const currentQuestions = useAppSelector(selectCurrentQuestions);
  const currentHistoryId = useAppSelector(selectCurrentHistoryId);

  useEffect(() => {
    if (allQuestionsAnswered) {
      dispatch(
        productsAsync({
          body: JSON.stringify(currentQuestions),
          historyId: currentHistoryId,
        })
      );
    }
  }, [currentHistoryId, currentQuestions, allQuestionsAnswered, dispatch]);

  return (
    <div className='relative mx-auto w-full h-fit grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center items-center'>
      {status === "loading" ? (
        <LoadingSpinner className='text-gray-500' width={45} height={45} />
      ) : (
        productList
          .slice(0, 4)
          .map((product, i) => <Product key={i} product={product} />)
      )}
    </div>
  );
};

export const ProductView = () => {
  const selectedProduct = useAppSelector(selectCurrentProduct);
  const { title, imgLink, price, bullets } = selectedProduct;
  const dispatch = useAppDispatch();
  return (
    <div className='flex flex-row p-8 border rounded-lg'>
      <div className='basis-1/2 justify-center items-center px-4'>
        <div
          className='flex my-2 gap-2 hover:underline hover:text-blue-400'
          onClick={() => {
            dispatch(updateCurrentProductId({ productId: "" }));
          }}
        >
          <ArrowLeftCircle />
          Back
        </div>
        {imgLink !== null && (
          <img
            src={imgLink}
            className={`mb-4 mt-4 border-4 border-gray-200 rounded p-2`}
          />
        )}

        <ul className='list-disc mx-4'>
          {bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      </div>
      <div className='basis-1/2 p-4'>
        <h1 className='text-xl font-bold mb-10'>{title}</h1>
        <h3 className='text-xl font-semibold'>{price}</h3>
        {
          //Chart Goes here
        }
      </div>
    </div>
  );
};
