export const useMessageInput => () {
const [text, setText] = useState("");
const [imagePreview, setImagePreview] = useState(null);
const fileInputRef = useRef(null);
const { sendMessage } = useChatStore();

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result);
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  setImagePreview(null);
  if (fileInputRef.current) fileInputRef.current.value = "";
};

const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!text.trim() && !imagePreview) return;

  try {fileInputRef
    await sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

  
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};
  return { imagePreview, handleImageChange, fileInputRef, text, setText, handleSendMessage, removeImage, imagePreview}
}