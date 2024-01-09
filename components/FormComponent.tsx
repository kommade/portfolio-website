import { submit } from "@/actions/actions";

const FormComponent: React.FC = () => {
    return (
        <form className="flex flex-col justify-center items-center" action={submit}>
            <label>
                Title:
                <input type="text" name="title" defaultValue='placeholder'/>
            </label>
            <label>
                Description:
                <input type="text" name="desc" defaultValue='placeholder'/>
            </label>
            <label>
                Image:
                <input type="file" name="image" accept="image/*"/>
            </label>
            <button className=" bg-white" type="submit">Submit</button>
        </form>
        );
}
    
export default FormComponent;