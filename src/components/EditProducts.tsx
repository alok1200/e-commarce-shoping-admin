import {
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  FormEvent,
} from "react";
import EditModal from "./EditModal";
import styled from "styled-components";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useDispatch } from "react-redux";
import { addProductapi, editProductapi } from "../redux/apiCalls/productsApis";
import { setError } from "../redux/MessageRedux";

interface ProductType {
  title: string;
  productno: string;
  size: string[];
  color: string[];
  desc: string;
  categories: string[];
  quantity: string;
  price: string;
  img: string | null;
}

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  EditProductInfo?: ProductType;
  title: string;
  desc: string;
}

const DefaultValues: ProductType = {
  title: "",
  productno: "",
  size: [],
  color: [],
  desc: "",
  categories: [],
  quantity: "",
  price: "",
  img: null,
};

const EditProducts: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  EditProductInfo,
  title,
  desc,
}) => {
  const dispatch = useDispatch();
  const [Product, setProduct] = useState<ProductType>(DefaultValues);

  useEffect(() => {
    if (!EditProductInfo) return;
    setProduct({ ...EditProductInfo });
  }, [EditProductInfo]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type?: keyof ProductType
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    const property = type || (name as keyof ProductType);

    if (name === "img" && files && files.length > 0) {
      const file = files[0];
      const filereader = new FileReader();
      filereader.readAsDataURL(file);
      filereader.onload = () => {
        setProduct((p) => ({ ...p, img: filereader.result as string }));
      };
      return;
    }

    const prev = Product[property];
    if (Array.isArray(prev)) {
      const exist = prev.filter((i) => i === value.toUpperCase());
      if (exist?.length) return;
    }

    setProduct((p) => ({
      ...p,
      [property]: Array.isArray(prev) ? [...prev, value.toUpperCase()] : value,
    }));

    e.target.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!Product.img)
      return dispatch(
        setError("Product Image can't be empty, Please add a Image!")
      );
    if (!Product.size.length)
      return dispatch(
        setError("Product Size can't be empty, Please add at least 1 size")
      );
    if (!Product.color.length)
      return dispatch(
        setError("Product Color can't be empty, Please add at least 1 color")
      );
    if (!Product.categories.length)
      return dispatch(
        setError(
          "Product Categories can't be empty, Please add at least 1 categories"
        )
      );

    if (!EditProductInfo) {
      addProductapi(dispatch, Product, setIsOpen);
    } else {
      editProductapi(dispatch, Product, setIsOpen);
    }
  };

  const handleDelete = (property: keyof ProductType, value: string) => {
    setProduct((p) => ({
      ...p,
      [property]: (p[property] as string[]).filter((i) => i !== value),
    }));
  };

  const ifForImg = Math.random() * 1000;

  return (
    <EditModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      action={handleSubmit}
      title={title}
      desc={desc}
    >
      {/* All styled components JSX remains unchanged */}
    </EditModal>
  );
};

export default EditProducts;
