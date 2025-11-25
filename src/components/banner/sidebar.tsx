import ReactMarkdown from "react-markdown"

const bannerProps = {
    desc: ""
}

export default function Banner({ desc }: { desc: string }) {
    return (
        <div>
            <ReactMarkdown>
                {desc}
            </ReactMarkdown>
        </div>
    );
}