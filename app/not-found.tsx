import Link from 'next/link';

/**
 * 404 page. GitHub Pages serves `out/404.html` for unmatched paths on its own,
 * so this needs no host configuration.
 */
export default function NotFound() {
  return (
    <main className="page" id="main">
      <div className="wrap">
        <p className="kicker">404 — NOT FOUND</p>
        <h1 className="page-title">페이지를 찾을 수 없습니다</h1>
        <p className="page-lead">
          주소가 바뀌었거나 삭제된 페이지입니다. 아래 링크에서 다시 찾아보세요.
        </p>
        <Link className="btn btn-primary mt-lg" href="/">
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
