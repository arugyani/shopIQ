import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { FC, useEffect } from "react";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
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
  selectCurrentQuery,
  selectCurrentProductId,
} from "@/app/features/historySlice";
import { ArrowLeftCircle } from "lucide-react";
import ProConList from "./ProConList";

interface ProductProps {
  product: ProductObject;
}

const Product: FC<ProductProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const { title, imgLink, price, reviews } = product;
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
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectProductStatus);
  const currentHistoryId = useAppSelector(selectCurrentHistoryId);
  const currentProductId = useAppSelector(selectCurrentProductId);
  const allQuestionsAnswered = useAppSelector(selectAllQuestionsAnswered);
  const currentQuery = useAppSelector(selectCurrentQuery);
  const currentQuestions = useAppSelector(selectCurrentQuestions);
  const productList = useAppSelector(selectCurrentProducts);

  useEffect(() => {
    if (allQuestionsAnswered) {
      if (productList.length === 0) {
        dispatch(
          productsAsync({
            query: currentQuery,
            body: currentQuestions,
            historyId: currentHistoryId,
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allQuestionsAnswered]);

  return currentProductId.length !== 0 ? (
    <ProductView />
  ) : (
    <div className='relative mx-auto w-full h-fit grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center items-center'>
      {status === "loading" ? (
        <LoadingSpinner className='text-gray-500' width={45} height={45} />
      ) : (
        productList.map((product, i) => <Product key={i} product={product} />)
      )}
    </div>
  );
};

export const ProductView = () => {
  const selectedProduct = useAppSelector(selectCurrentProduct);
  const { title, imgLink, prodLink, price, bullets, pros, cons } =
    selectedProduct;
  const dispatch = useAppDispatch();

  return (
    <div className='flex flex-row p-8 border rounded-lg h-fit'>
      <div
        className='flex my-2 gap-2 h-fit w-fit text-gray-500 hover:underline hover:text-blue-400 cursor-pointer'
        onClick={() => {
          dispatch(updateCurrentProductId({ productId: "" }));
        }}
      >
        <ArrowLeftCircle />
      </div>
      <div className='basis-1/2 flex flex-col justify-center items-center px-4'>
        {imgLink !== null && (
          <img
            src={imgLink}
            className={`max-w-[200px] px-4 py-2 mb-4 bg-white drop-shadow rounded p-2`}
          />
        )}

        <ul className='list-disc mx-4'>
          {bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      </div>
      <div className='basis-1/2 p-4 flex flex-col gap-8 text-center justify-start items-center'>
        <div className='flex flex-row'>
          <a
            className='blue-link text-lg font-bold mr-4 text-blue-500'
            href={prodLink}
          >
            {title.length <= 20 ? title : `${title.substring(0, 20)}...`}
          </a>
          <h3 className='text-lg font-light text-gray-500'>{price}</h3>
        </div>
        <div className='flex flex-col w-full items-center gap-2'>
          <ProConList pros={pros} cons={cons} />
        </div>
      </div>
    </div>
  );
};
