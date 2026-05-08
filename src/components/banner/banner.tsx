import ReactMarkdown from "react-markdown"

export default function Banner({ desc }: { desc: string }) {
    return (
        <div>
            <ReactMarkdown>
                {desc}
            </ReactMarkdown>
        </div>
    );
}