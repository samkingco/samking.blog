import NextLink, { LinkProps } from "next/link";
import { MDXRemote } from "next-mdx-remote";
import { Post } from "../mdx-utils";

interface CustomLinkProps extends LinkProps {
  children: React.ReactNode;
}

function CustomLink({ as, href, children, ...props }: CustomLinkProps) {
  return (
    <NextLink as={as} href={href}>
      <a {...props}>{children}</a>
    </NextLink>
  );
}

const components = {
  a: CustomLink,
};

interface Props {
  content: Post["content"];
}

export function PostContent({ content }: Props) {
  return <MDXRemote {...content} components={components} />;
}
