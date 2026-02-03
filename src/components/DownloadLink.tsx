type Props = {
  url: string;
};

export default function DownloadLink({ url }: Props) {
  return (
    <a className="download" href={url} download>
      Download File
    </a>
  );
}
