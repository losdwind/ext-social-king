import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom"

export function Detail() {
  const {id} = useParams();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1)
  }
  return (
  <div>
    <Button onClick={handleBackClick}>
    <ArrowLeftIcon />
    </Button>
    <div>
    detail: {id}
    </div>
  </div>
)
}
