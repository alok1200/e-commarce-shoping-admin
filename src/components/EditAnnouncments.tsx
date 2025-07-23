import { useState, useEffect, ChangeEvent } from "react";
import EditModal from "./EditModal";
import styled from "styled-components";
import { req } from "../axiosReqMethods";
import { setError } from "../redux/MessageRedux";
import { useDispatch } from "react-redux";
import { addannouncements, editAnnoucment } from "../redux/AnnoucmentRedux";

const Container = styled.div`
  margin: 1rem 0;
  display: grid;
  gap: 1rem;

  @media (max-width: 800px) {
    margin-left: 1em;
  }
`;

const Section = styled.div`
  display: flex;

  @media (max-width: 800px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Left = styled.div`
  flex: 1;
`;

const Right = styled.div`
  flex: 2;

  > input,
  select {
    box-sizing: border-box;
    width: 100%;
    padding: 0.9rem 0.5rem;
    background-color: #f4f5f7;
    border: 1px rgb(229, 231, 235) solid;
    border-radius: 1vmin;
    font-size: 1.1rem;
    outline: none;

    :focus {
      background-color: white;
    }
  }
`;

const Textarea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  height: 500px;
  resize: vertical;
  padding: 0.9rem 0.5rem;
  background-color: #f4f5f7;
  border: 1px rgb(229, 231, 235) solid;
  border-radius: 1vmin;
  font-size: 1.1rem;
  outline-color: lightblue;
`;

// ---------- Props & Types ----------

interface Announcement {
  _id?: string;
  title: string;
  active: boolean;
}

interface EditAnnouncmentsProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  EditAnnouncmentsInfo?: Announcement;
  title: string;
  desc: string;
}

// ---------- Component ----------

function EditAnnouncments({
  isOpen,
  setIsOpen,
  EditAnnouncmentsInfo,
  title,
  desc,
}: EditAnnouncmentsProps) {
  const dispatch = useDispatch();
  const defaultValues: Announcement = { title: "", active: false };
  const [annoucment, setAnnoucment] = useState<Announcement>(defaultValues);

  useEffect(() => {
    if (!EditAnnouncmentsInfo) return;
    setAnnoucment({ ...EditAnnouncmentsInfo });
  }, [EditAnnouncmentsInfo]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name as keyof Announcement;
    let value: string | boolean = e.target.value;
    if (name === "active") value = JSON.parse(value); // converts "true"/"false" to boolean
    setAnnoucment((prev) => ({ ...prev, [name]: value }));
  };

  const editAnnouncmentApi = async () => {
    try {
      const { data } = await req.put(`/api/announcment/${annoucment._id}`, {
        title: annoucment.title,
        active: annoucment.active,
      });
      dispatch(setError(data?.message));
      dispatch(editAnnoucment(annoucment));
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || "Something went wrong.")
      );
    }
  };

  const addAnnouncmentApi = async () => {
    try {
      const { data } = await req.post("/api/annoucment", annoucment);
      dispatch(setError(data?.message));
      dispatch(addannouncements(annoucment));
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || "Something went wrong.")
      );
    }
  };

  const handleSubmit = () => {
    if (!EditAnnouncmentsInfo) {
      addAnnouncmentApi();
    } else {
      editAnnouncmentApi();
    }
    setIsOpen(false);
  };

  return (
    <EditModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      action={handleSubmit}
      title={title}
      desc={desc}
    >
      <Container>
        <Section>
          <Left>
            <label>Product Description</label>
          </Left>
          <Right>
            <Textarea
              name="title"
              value={annoucment.title}
              onChange={handleChange}
              required
            />
          </Right>
        </Section>

        <Section>
          <Left>
            <label>Is Activated</label>
          </Left>
          <Right>
            <select
              name="active"
              value={String(annoucment.active)}
              onChange={handleChange}
            >
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          </Right>
        </Section>
      </Container>
    </EditModal>
  );
}

export default EditAnnouncments;
