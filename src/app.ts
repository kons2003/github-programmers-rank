async function main() {
  const id = process.env.PROGRAMMERS_TOKEN_ID;
  const pw = process.env.PROGRAMMERS_TOKEN_PW;

  if (!id || !pw) {
    throw new Error("PROGRAMMERS_TOKEN_ID 또는 PROGRAMMERS_TOKEN_PW가 없습니다.");
  }

  try {
    const loginResponse = await useAxios(
      PROGRAMMERS_SIGN_IN,
      "POST",
      {
        user: {
          email: id,
          password: pw,
        },
      },
    );

    console.log("login status:", loginResponse.status);
    console.log("login response keys:", Object.keys(loginResponse.data ?? {}));

    const cookies = loginResponse.headers["set-cookie"];

    if (loginResponse.status < 200 || loginResponse.status >= 300) {
      throw new Error(
        `프로그래머스 로그인 실패: HTTP ${loginResponse.status}`,
      );
    }

    if (!cookies?.length) {
      throw new Error("로그인 응답에 set-cookie가 없습니다.");
    }

    console.log("cookie count:", cookies.length);

    const recordResponse = await useAxios(
      PROGRAMMERS_USER_RECORD,
      "GET",
      undefined,
      cookies,
    );

    console.log("record status:", recordResponse.status);
    console.log(
      "record response keys:",
      Object.keys(recordResponse.data ?? {}),
    );

    if (recordResponse.status < 200 || recordResponse.status >= 300) {
      throw new Error(
        `프로그래머스 기록 조회 실패: HTTP ${recordResponse.status}`,
      );
    }

    const myData = recordResponse.data;

    if (
      !myData?.skillCheck ||
      !myData?.ranking ||
      !myData?.codingTest
    ) {
      throw new Error("프로그래머스 기록 응답 구조가 예상과 다릅니다.");
    }

    console.log("level:", myData.skillCheck.level);
    console.log("score:", myData.ranking.score);
    console.log("solved:", myData.codingTest.solved);
    console.log("rank:", myData.ranking.rank);

    // 기존 SVG 생성 로직
  } catch (error: any) {
    console.error("프로그래머스 API 오류:", error.response?.status);
    console.error("응답:", error.response?.data ?? error.message);
    process.exitCode = 1;
  }
}
